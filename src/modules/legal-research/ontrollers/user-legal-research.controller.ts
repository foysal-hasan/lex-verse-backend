import { 
  Controller, 
  Get, 
  Param, 
  Query,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LegalResearchService } from '../legal-research.service';
import { FilterLegalResearchDto } from '../dto/filter-legal-research.dto';

import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { TransformResponseInterceptor } from 'src/common/interceptors/response.interceptor';

@ApiTags('Legal Research (User)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(TransformResponseInterceptor)
@Controller('legal-research')
export class UserLegalResearchController {
  constructor(private readonly legalResearchService: LegalResearchService) {}

  @Get()
  @ApiOperation({ summary: 'Get legal research papers with search filters, tags, sorting, and pagination' })
  @ApiResponse({ status: 200, description: 'List of research documents returned successfully.' })
  findAll(@Query() filters: FilterLegalResearchDto) {
    return this.legalResearchService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a specific legal research paper details by ID' })
  @ApiResponse({ status: 200, description: 'Research found successfully.' })
  @ApiResponse({ status: 404, description: 'Research not found.' })
  findOne(@Param('id') id: string) {
    return this.legalResearchService.findOne(id);
  }
}