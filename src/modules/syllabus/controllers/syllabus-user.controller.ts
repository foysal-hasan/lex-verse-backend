import { Controller, Get, Param, Query, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { Request } from 'express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SyllabusService } from '../syllabus.service';
import { QuerySyllabusDto } from '../dto/query-syllabus.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { TransformResponseInterceptor } from 'src/common/interceptors/response.interceptor';

@ApiTags('User - Syllabuses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(TransformResponseInterceptor)
@Controller('syllabuses')
export class SyllabusUserController {
  constructor(private readonly syllabusService: SyllabusService) {}

  @Get()
  @ApiOperation({ summary: 'Get all syllabuses for a specific package with filter, search, sort, pagination (User)' })
  findAllForUser(@Query() query: QuerySyllabusDto, @Req() req: Request) {
    const userId = (req.user as any).userId;
    return this.syllabusService.findAllForUser(userId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single syllabus with active package subscription check (User)' })
  findOneForUser(@Param('id') id: string, @Req() req: Request) {
    const userId = (req.user as any).userId;
    return this.syllabusService.findOneForUser(id, userId);
  }
}