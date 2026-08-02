import { 
  Controller, 
  Get, 
  Param, 
  Query,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LegalDictionaryService } from '../legal-dictionary.service';
import { FilterLegalDictionaryDto } from '../dto/filter-legal-dictionary.dto';

import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { TransformResponseInterceptor } from 'src/common/interceptors/response.interceptor';

@ApiTags('Legal Dictionary (User)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(TransformResponseInterceptor)
@Controller('legal-dictionary')
export class UserLegalDictionaryController {
  constructor(private readonly legalDictionaryService: LegalDictionaryService) {}

  @Get()
  @ApiOperation({ summary: 'Get legal dictionary items with filtering (including letter start), sorting, and pagination' })
  @ApiResponse({ status: 200, description: 'List of dictionary entries returned successfully.' })
  findAll(@Query() filters: FilterLegalDictionaryDto) {
    return this.legalDictionaryService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find specific legal dictionary definition by ID' })
  @ApiResponse({ status: 200, description: 'Entry found successfully.' })
  @ApiResponse({ status: 404, description: 'Entry not found.' })
  findOne(@Param('id') id: string) {
    return this.legalDictionaryService.findOne(id);
  }
}