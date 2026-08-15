import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  StreamableFile,
  Header,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { BareActService } from '../bare-act.service';
import { QueryBareActDto } from '../dto/query-bare-act.dto';
import { TransformResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { Storage } from 'src/common/lib/Disk/Storage';

@ApiTags('User - Bare Acts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(TransformResponseInterceptor)
@Controller('bare-acts')
export class BareActUserController {
  constructor(private readonly bareActService: BareActService) {}

  @Get('categories')
  @ApiOperation({ summary: 'List unique categories of Bare Acts' })
  async getCategories() {
    return this.bareActService.getUniqueCategories();
  }

  @Get()
  @ApiOperation({ summary: 'List active Bare Acts with search, filter, and pagination' })
  async findAll(@Query() query: QueryBareActDto) {
    return this.bareActService.findAll(query, false);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get active Bare Act details by ID' })
  async findOne(@Param('id') id: string) {
    return this.bareActService.findOne(id, false);
  }

  @Get(':id/download')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Download Bare Act PDF document' })
  async downloadPdf(@Param('id') id: string): Promise<StreamableFile> {
    const { file_path, filename, type } = await this.bareActService.getDownloadFile(id);
    const fileStream = await Storage.getStream(file_path);

    return new StreamableFile(fileStream, {
      disposition: `attachment; filename="${filename}"`,
      type: type,
    });
  }
}