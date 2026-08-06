import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAccessRequestDto } from './dto/create-access-request.dto';
import { ReviewAccessRequestDto } from './dto/review-access-request.dto';
import { 
  QueryPackageAccessRequestDto, 
  QueryUserPackageAccessDto, 
  PaginationQueryDto,
  SortOrder 
} from './dto/query-purchase.dto';
import { ExtendGrantDto, RevokeGrantDto } from './dto/grant-actions.dto';
import { PkgReqStatus, PkgAccStatus } from '@prisma/client';

@Injectable()
export class PackagePurchaseService {
  constructor(private readonly prisma: PrismaService) {}

  // -------------------------------------------------------------
  // USER: Submit Manual Payment Request
  // -------------------------------------------------------------
  async createAccessRequest(userId: string, dto: CreateAccessRequestDto) {
    const pkg = await this.prisma.package.findUnique({
      where: { id: dto.package_id },
    });

    if (!pkg) {
      throw new NotFoundException('Package not found');
    }

    const existingAccess = await this.prisma.userPackageAccess.findUnique({
      where: {
        user_id_package_id: {
          user_id: userId,
          package_id: dto.package_id,
        },
      },
    });

    if (existingAccess && existingAccess.status === PkgAccStatus.active) {
      throw new ConflictException('You already have active access to this package.');
    }

    const pendingRequest = await this.prisma.packageAccessRequest.findFirst({
      where: {
        user_id: userId,
        package_id: dto.package_id,
        status: PkgReqStatus.pending,
      },
    });

    if (pendingRequest) {
      throw new ConflictException('You already have a pending access request for this package.');
    }

    return this.prisma.packageAccessRequest.create({
      data: {
        user_id: userId,
        package_id: dto.package_id,
        name: dto.name,
        phone: dto.phone,
        payment_method: dto.payment_method,
        transaction_id: dto.transaction_id,
        message: dto.message,
        client_request_uuid: dto.client_request_uuid,
        status: PkgReqStatus.pending,
      },
      include: {
        package: { select: { id: true, title_bn: true, price_bdt: true } },
      },
    });
  }

  // -------------------------------------------------------------
  // USER: List My Access Requests
  // -------------------------------------------------------------
  async findMyRequests(userId: string, query: QueryPackageAccessRequestDto) {
    const { page = 1, limit = 10, status, search, sort = SortOrder.newest } = query;
    const skip = (page - 1) * limit;

    const where: Record<string, any> = { user_id: userId };
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { phone: { contains: search, mode: 'insensitive' } },
        { transaction_id: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.packageAccessRequest.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: sort === SortOrder.newest ? 'desc' : 'asc' },
        include: { package: { select: { id: true, title_bn: true, price_bdt: true } } },
      }),
      this.prisma.packageAccessRequest.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, total_pages: Math.ceil(total / limit) },
    };
  }

  // -------------------------------------------------------------
  // USER: List My Granted Package Accesses
  // -------------------------------------------------------------
  async findMyPackageAccesses(userId: string, query: QueryUserPackageAccessDto) {
    const { page = 1, limit = 10, status, package_id } = query;
    const skip = (page - 1) * limit;

    const where: Record<string, any> = { user_id: userId };
    if (status) where.status = status;
    if (package_id) where.package_id = package_id;

    const [data, total] = await Promise.all([
      this.prisma.userPackageAccess.findMany({
        where,
        skip,
        take: limit,
        orderBy: { granted_at: 'desc' },
        include: { package: true },
      }),
      this.prisma.userPackageAccess.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, total_pages: Math.ceil(total / limit) },
    };
  }

  // -------------------------------------------------------------
  // ADMIN: List All Access Requests
  // -------------------------------------------------------------
  async findAllRequests(query: QueryPackageAccessRequestDto) {
    const { page = 1, limit = 10, status, user_id, search, sort = SortOrder.newest } = query;
    const skip = (page - 1) * limit;

    const where: Record<string, any> = {};
    if (user_id) where.user_id = user_id;
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { phone: { contains: search, mode: 'insensitive' } },
        { transaction_id: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.packageAccessRequest.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: sort === SortOrder.newest ? 'desc' : 'asc' },
        include: {
          user: { select: { id: true, name: true, email: true } },
          package: { select: { id: true, title_bn: true, price_bdt: true } },
        },
      }),
      this.prisma.packageAccessRequest.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, total_pages: Math.ceil(total / limit) },
    };
  }

  // -------------------------------------------------------------
  // ADMIN: Review (Approve / Reject) Access Request
  // -------------------------------------------------------------
  async reviewRequest(requestId: string, dto: ReviewAccessRequestDto, adminId: string) {
    const request = await this.prisma.packageAccessRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      throw new NotFoundException('Package access request not found');
    }

    return this.prisma.$transaction(async (tx) => {
      const updatedRequest = await tx.packageAccessRequest.update({
        where: { id: requestId },
        data: {
          status: dto.status,
          decision_note: dto.decision_note,
          decided_by: adminId,
          decided_at: new Date(),
        },
      });

      if (dto.status === PkgReqStatus.approved) {
        const expiresAt = dto.expires_at ? new Date(dto.expires_at) : null;

        await tx.userPackageAccess.upsert({
          where: {
            user_id_package_id: {
              user_id: request.user_id,
              package_id: request.package_id,
            },
          },
          update: {
            status: PkgAccStatus.active,
            request_id: request.id,
            granted_by: adminId,
            granted_at: new Date(),
            starts_at: new Date(),
            expires_at: expiresAt,
            revoked_by: null,
            revoked_at: null,
            revoke_reason: null,
          },
          create: {
            user_id: request.user_id,
            package_id: request.package_id,
            request_id: request.id,
            granted_by: adminId,
            status: PkgAccStatus.active,
            expires_at: expiresAt,
          },
        });
      }

      return updatedRequest;
    });
  }

  // -------------------------------------------------------------
  // ADMIN: List All User Package Accesses (Grants Page)
  // -------------------------------------------------------------
  async findAllUserAccesses(query: QueryUserPackageAccessDto) {
    const { page = 1, limit = 10, status, package_id } = query;
    const skip = (page - 1) * limit;

    const where: Record<string, any> = {};
    if (package_id) where.package_id = package_id;
    if (status) where.status = status;

    const [data, total] = await Promise.all([
      this.prisma.userPackageAccess.findMany({
        where,
        skip,
        take: limit,
        orderBy: { granted_at: 'desc' },
        include: {
          user: { select: { id: true, name: true, email: true } },
          package: { select: { id: true, title_bn: true, price_bdt: true } },
          granted_by_user: { select: { id: true, name: true } },
          revoked_by_user: { select: { id: true, name: true } },
        },
      }),
      this.prisma.userPackageAccess.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, total_pages: Math.ceil(total / limit) },
    };
  }

  // -------------------------------------------------------------
  // ADMIN ACTIONS: Extend Grant & Revoke Grant
  // -------------------------------------------------------------
  async extendGrant(accessId: string, dto: ExtendGrantDto) {
    const access = await this.prisma.userPackageAccess.findUnique({
      where: { id: accessId },
    });
    if (!access) throw new NotFoundException('Package access record not found');

    return this.prisma.userPackageAccess.update({
      where: { id: accessId },
      data: {
        expires_at: new Date(dto.expires_at),
        status: PkgAccStatus.active, // Reactivate if it was expired
      },
    });
  }

  async revokeGrant(accessId: string, dto: RevokeGrantDto, adminId: string) {
    const access = await this.prisma.userPackageAccess.findUnique({
      where: { id: accessId },
    });
    if (!access) throw new NotFoundException('Package access record not found');

    return this.prisma.userPackageAccess.update({
      where: { id: accessId },
      data: {
        status: PkgAccStatus.revoked,
        revoked_by: adminId,
        revoked_at: new Date(),
        revoke_reason: dto.revoke_reason,
      },
    });
  }

  // -------------------------------------------------------------
  // ADMIN ANALYTICS: Overview Analytics
  // -------------------------------------------------------------
  async getOverviewAnalytics() {
    const [
      activeGrants,
      expiredGrants,
      pendingRequests,
      oldestPending,
      decidedRequests,
    ] = await Promise.all([
      this.prisma.userPackageAccess.count({ where: { status: PkgAccStatus.active } }),
      this.prisma.userPackageAccess.count({ where: { status: PkgAccStatus.expired } }),
      this.prisma.packageAccessRequest.count({ where: { status: PkgReqStatus.pending } }),
      this.prisma.packageAccessRequest.findFirst({
        where: { status: PkgReqStatus.pending },
        orderBy: { created_at: 'asc' },
        include: {
          user: { select: { id: true, name: true, email: true } },
          package: { select: { id: true, title_bn: true } },
        },
      }),
      this.prisma.packageAccessRequest.findMany({
        where: { decided_at: { not: null } },
        select: { created_at: true, decided_at: true },
      }),
    ]);

    // Calculate Average Decision Time in minutes/hours
    let avgDecisionTimeMinutes = 0;
    if (decidedRequests.length > 0) {
      const totalMs = decidedRequests.reduce((acc, req) => {
        const diff = new Date(req.decided_at!).getTime() - new Date(req.created_at).getTime();
        return acc + diff;
      }, 0);
      avgDecisionTimeMinutes = Math.round(totalMs / decidedRequests.length / (1000 * 60));
    }

    return {
      active_grants: activeGrants,
      expired_grants: expiredGrants,
      pending_requests: pendingRequests,
      avg_decision_time_minutes: avgDecisionTimeMinutes,
      oldest_pending_request: oldestPending,
    };
  }

  // -------------------------------------------------------------
  // ADMIN ANALYTICS: Per-package metrics with pagination
  // -------------------------------------------------------------
  async getPerPackageMetrics(query: PaginationQueryDto) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const [packages, total] = await Promise.all([
      this.prisma.package.findMany({
        skip,
        take: limit,
        include: {
          access_requests: {
            select: { status: true, created_at: true, decided_at: true },
          },
          user_accesses: {
            select: { status: true },
          },
        },
      }),
      this.prisma.package.count(),
    ]);

    const data = packages.map((pkg) => {
      const activeCount = pkg.user_accesses.filter(a => a.status === PkgAccStatus.active).length;
      const expiredCount = pkg.user_accesses.filter(a => a.status === PkgAccStatus.expired).length;
      const revokedCount = pkg.user_accesses.filter(a => a.status === PkgAccStatus.revoked).length;
      const pendingCount = pkg.access_requests.filter(r => r.status === PkgReqStatus.pending).length;

      // Pending requests sorted by creation for oldest pending
      const pendingReqs = pkg.access_requests.filter(r => r.status === PkgReqStatus.pending);
      const oldestPendingReq = pendingReqs.length > 0 
        ? pendingReqs.reduce((oldest, curr) => curr.created_at < oldest.created_at ? curr : oldest)
        : null;

      // Avg decision time for this package
      const decidedReqs = pkg.access_requests.filter(r => r.decided_at !== null);
      let avgDecisionTimeMinutes = 0;
      if (decidedReqs.length > 0) {
        const totalMs = decidedReqs.reduce((acc, req) => {
          return acc + (new Date(req.decided_at!).getTime() - new Date(req.created_at).getTime());
        }, 0);
        avgDecisionTimeMinutes = Math.round(totalMs / decidedReqs.length / (1000 * 60));
      }

      return {
        package_id: pkg.id,
        package_name: pkg.title_bn,
        price: pkg.price_bdt,
        metrics: {
          active: activeCount,
          expired: expiredCount,
          revoked: revokedCount,
          pending: pendingCount,
          avg_decision_time_minutes: avgDecisionTimeMinutes,
          oldest_pending_created_at: oldestPendingReq ? oldestPendingReq.created_at : null,
        },
      };
    });

    return {
      data,
      meta: { total, page, limit, total_pages: Math.ceil(total / limit) },
    };
  }
}