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
  constructor(private readonly prisma: PrismaService) { }

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

    // check payment mehtod and transaction_id already exists
    const existingRequestWithSameTransactionIdAndMethod = await this.prisma.packageAccessRequest.findFirst({
      where: {
        payment_method: dto.payment_method,
        transaction_id: dto.transaction_id,
      },
    });

    if (existingRequestWithSameTransactionIdAndMethod) {
      throw new ConflictException(`With transaction id ${dto.transaction_id} purchase request can not be submitted`);
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
        package: { select: { id: true, title: true, price: true, discount_price: true } },
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

    const [items, total] = await Promise.all([
      this.prisma.packageAccessRequest.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: sort === SortOrder.newest ? 'desc' : 'asc' },
        include: { package: { select: { id: true, title: true, price: true, discount_price: true } } },
      }),
      this.prisma.packageAccessRequest.count({ where }),
    ]);

    return {
      items,
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

    const [items, total] = await Promise.all([
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
      items,
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

    const [items, total] = await Promise.all([
      this.prisma.packageAccessRequest.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: sort === SortOrder.newest ? 'desc' : 'asc' },
        include: {
          user: { select: { id: true, name: true, email: true } },
          package: { select: { id: true, title: true, price: true, discount_price: true } },
        },
      }),
      this.prisma.packageAccessRequest.count({ where }),
    ]);

    return {
      items,
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

    const [items, total] = await Promise.all([
      this.prisma.userPackageAccess.findMany({
        where,
        skip,
        take: limit,
        orderBy: { granted_at: 'desc' },
        include: {
          user: { select: { id: true, name: true, email: true } },
          package: { select: { id: true, title: true, price: true, discount_price: true } },
          granted_by_user: { select: { id: true, name: true } },
          revoked_by_user: { select: { id: true, name: true } },
        },
      }),
      this.prisma.userPackageAccess.count({ where }),
    ]);

    return {
      items,
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
    // 1. Run all counts, oldest pending, and raw average query in parallel
    const [
      activeGrants,
      expiredGrants,
      pendingRequests,
      oldestPending,
      avgResult,
    ] = await Promise.all([
      this.prisma.userPackageAccess.count({ where: { status: PkgAccStatus.active } }),
      this.prisma.userPackageAccess.count({ where: { status: PkgAccStatus.expired } }),
      this.prisma.packageAccessRequest.count({ where: { status: PkgReqStatus.pending } }),
      this.prisma.packageAccessRequest.findFirst({
        where: { status: PkgReqStatus.pending },
        orderBy: { created_at: 'asc' },
        select: { created_at: true },
      }),
      // Calculate global average decision time (in minutes) via raw SQL aggregation
      this.prisma.$queryRaw<Array<{ avg_minutes: number | null }>>`
        SELECT AVG(EXTRACT(EPOCH FROM (decided_at - created_at)) / 60) as avg_minutes
        FROM package_access_requests
        WHERE decided_at IS NOT NULL
      `,
    ]);

    // Extract the average minutes from the raw query result safely
    const avgMinutesRaw = avgResult[0]?.avg_minutes;
    const avgDecisionTimeMinutes = avgMinutesRaw !== null && avgMinutesRaw !== undefined
      ? Math.round(Number(avgMinutesRaw))
      : 0;

    return {
      active_grants: activeGrants,
      expired_grants: expiredGrants,
      pending_requests: pendingRequests,
      avg_decision_time_minutes: avgDecisionTimeMinutes,
      oldest_pending_request: oldestPending?.created_at || null,
    };
  }

  // -------------------------------------------------------------
  // ADMIN ANALYTICS: Per-package metrics with pagination
  // -------------------------------------------------------------
  async getPerPackageMetrics(query: PaginationQueryDto) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    // 1. Fetch paginated packages and total count simultaneously
    const [packages, total] = await Promise.all([
      this.prisma.package.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          price: true,
          discount_price: true,
        },
      }),
      this.prisma.package.count(),
    ]);

    if (packages.length === 0) {
      return {
        items: [],
        meta: { total, page, limit, total_pages: 0 },
      };
    }

    const packageIds = packages.map((pkg) => pkg.id);

    // 2. Fetch all required metrics, decision times, and oldest pending requests in parallel
    const [userAccessCounts, requestStatusCounts, decisionTimeStats, oldestPendingRequests] = await Promise.all([
      // Group user package accesses by package_id and status
      this.prisma.userPackageAccess.groupBy({
        by: ['package_id', 'status'],
        where: { package_id: { in: packageIds } },
        _count: { status: true },
      }),
      // Group request statuses by package_id
      this.prisma.packageAccessRequest.groupBy({
        by: ['package_id', 'status'],
        where: { package_id: { in: packageIds } },
        _count: { status: true },
      }),
      // Calculate average decision time per package (in minutes) via raw query aggregation
      this.prisma.$queryRaw<Array<{ package_id: string; avg_minutes: number }>>`
        SELECT package_id, AVG(EXTRACT(EPOCH FROM (decided_at - created_at)) / 60) as avg_minutes
        -- Note: using "package_access_requests" mapping your prisma schema table map
        FROM package_access_requests 
        WHERE package_id = ANY(${packageIds}) AND decided_at IS NOT NULL
        GROUP BY package_id
      `,
      // Find the oldest pending request for each package
      this.prisma.packageAccessRequest.findMany({
        where: {
          package_id: { in: packageIds },
          status: PkgReqStatus.pending,
        },
        orderBy: { created_at: 'asc' },
        select: {
          package_id: true,
          created_at: true,
        },
      }),
    ]);

    // 3. Build fast O(1) maps for lookups
    const accessMap = new Map<string, Record<string, number>>();
    for (const item of userAccessCounts) {
      if (!accessMap.has(item.package_id)) accessMap.set(item.package_id, {});
      accessMap.get(item.package_id)![item.status] = item._count.status;
    }

    const requestMap = new Map<string, Record<string, number>>();
    for (const item of requestStatusCounts) {
      if (!requestMap.has(item.package_id)) requestMap.set(item.package_id, {});
      requestMap.get(item.package_id)![item.status] = item._count.status;
    }

    const avgDecisionTimeMap = new Map<string, number>();
    for (const item of decisionTimeStats) {
      avgDecisionTimeMap.set(item.package_id, Math.round(Number(item.avg_minutes) || 0));
    }

    // Since findMany is ordered by created_at asc, the first one encountered for a package is the oldest
    const oldestPendingMap = new Map<string, Date>();
    for (const req of oldestPendingRequests) {
      if (!oldestPendingMap.has(req.package_id)) {
        oldestPendingMap.set(req.package_id, req.created_at);
      }
    }

    // 4. Construct final response items efficiently
    const items = packages.map((pkg) => {
      const accCounts = accessMap.get(pkg.id) || {};
      const reqCounts = requestMap.get(pkg.id) || {};

      return {
        package_id: pkg.id,
        package_name: pkg.title,
        price: pkg.price ? pkg.price.toNumber() : 0,
        discount_price: pkg.discount_price ? pkg.discount_price.toNumber() : 0,
        metrics: {
          active: accCounts[PkgAccStatus.active] || 0,
          expired: accCounts[PkgAccStatus.expired] || 0,
          revoked: accCounts[PkgAccStatus.revoked] || 0,
          pending: reqCounts[PkgReqStatus.pending] || 0,
          avg_decision_time_minutes: avgDecisionTimeMap.get(pkg.id) || 0,
          oldest_pending_created_at: oldestPendingMap.get(pkg.id) || null,
        },
      };
    });

    return {
      items,
      meta: { total, page, limit, total_pages: Math.ceil(total / limit) },
    };
  }
}