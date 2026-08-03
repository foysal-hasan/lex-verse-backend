import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  StreamableFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { CaseReferenceService } from '../case-reference.service';
import { QueryCaseReferenceDto } from '../dto/query-case-reference.dto';
import { TransformResponseInterceptor } from 'src/common/interceptors/response.interceptor';

@ApiTags('User - Case References')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(TransformResponseInterceptor)
@Controller('case-references')
export class CaseReferenceUserController {
  constructor(private readonly caseReferenceService: CaseReferenceService) {}

  @Get()
  @ApiOperation({ summary: 'List published Case References with search, filters, & pagination' })
  async findAll(@Query() query: QueryCaseReferenceDto) {
    return this.caseReferenceService.findAll(query, false);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get list of all unique categories' })
  async getCategories() {
    return this.caseReferenceService.getUniqueCategories();
  }

  @Get('courts')
  @ApiOperation({ summary: 'Get list of all unique courts' })
  async getCourts() {
    return this.caseReferenceService.getUniqueCourts();
  }

  @Get(':idOrSlug')
  @ApiOperation({ summary: 'Get Case Reference details by UUID or Slug' })
  async findOne(@Param('idOrSlug') idOrSlug: string) {
    return this.caseReferenceService.findOne(idOrSlug, false);
  }

  @Get(':idOrSlug/download')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Download Case Reference PDF document' })
  async downloadPdf(@Param('idOrSlug') idOrSlug: string): Promise<StreamableFile> {
    const { stream, filename, type } =
      await this.caseReferenceService.getDownloadStream(idOrSlug);

    return new StreamableFile(stream, {
      disposition: `attachment; filename="${filename}"`,
      type,
    });
  }
}