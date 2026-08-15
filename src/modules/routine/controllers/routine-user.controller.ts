import { Controller, Get, Param, Query, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { Request } from 'express';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { RoutineService } from '../routine.service';
import { QueryRoutineUserDto } from '../dto/query-routine-user.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { TransformResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { PkgProgram } from 'src/generated/prisma/enums';

@ApiTags('User - Routines')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(TransformResponseInterceptor)
@Controller('routines')
export class RoutineUserController {
  constructor(private readonly routineService: RoutineService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get total, done, remaining, and next exam date for a package (User)' })
  @ApiQuery({ name: 'package_id', required: true, type: String })
  @ApiQuery({ name: 'program_type', required: true, enum: PkgProgram })
  getStats(
    @Query('package_id') packageId: string,
    @Query('program_type') programType: PkgProgram,
    @Req() req: Request,
  ) {
    const userId = (req.user as any).userId;
    return this.routineService.getRoutineStats(userId, packageId, programType);
  }

  @Get()
  @ApiOperation({ summary: 'Find all routines for a package and program with all/remain/done filter (User)' })
  findAllForUser(@Query() query: QueryRoutineUserDto, @Req() req: Request) {
    const userId = (req.user as any).userId;
    return this.routineService.findAllForUser(userId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find single routine details with package access check (User)' })
  findOneForUser(@Param('id') id: string, @Req() req: Request) {
    const userId = (req.user as any).userId;
    return this.routineService.findOneForUser(id, userId);
  }
}