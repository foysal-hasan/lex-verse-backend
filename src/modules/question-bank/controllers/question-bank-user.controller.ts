import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  StreamableFile,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { QuestionBankService } from '../question-bank.service';
import { QueryQuestionBankDto } from '../dto/query-question-bank.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from 'src/modules/auth/guards/optional-jwt-auth.guard';
import { TransformResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { Request } from 'express';
import { Storage } from 'src/common/lib/Disk/Storage';

@ApiTags('User - Question Banks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(TransformResponseInterceptor)
@Controller('question-banks')
export class QuestionBankUserController {
  constructor(private readonly questionBankService: QuestionBankService) { }

  @Get()
  @ApiOperation({ summary: 'List published Question Banks with search, filters, & unlock status' })
  async findAll(@Query() query: QueryQuestionBankDto, @Req() req: Request) {
    const userId = req.user?.userId;
    return this.questionBankService.findAll(query, userId, false);
  }

  @Get('programs')
  @ApiOperation({ summary: 'Get list of unique program types' })
  async getProgramTypes() {
    return this.questionBankService.getUniqueProgramTypes();
  }

  @Get('exams')
  @ApiOperation({ summary: 'Get list of unique exam types' })
  async getExamTypes() {
    return this.questionBankService.getUniqueExamTypes();
  }

  @Get('subjects')
  @ApiOperation({ summary: 'Get list of unique subjects' })
  async getSubjects() {
    return this.questionBankService.getUniqueSubjects();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a Question Bank' })
  async findOne(@Param('id') id: string, @Req() req: any) {
    const userId = req.user?.id;
    return this.questionBankService.findOne(id, userId, false);
  }

  @Get(':id/download')
  @ApiOperation({ summary: 'Download Question Bank PDF file' })
  async downloadPdf(@Param('id') id: string, @Req() req: Request): Promise<StreamableFile> {
    const userId = req.user.userId;
    const { stream, filename, type } = await this.questionBankService.getDownloadFileStream(
      id,
      userId,
    );

    return new StreamableFile(stream, {
      disposition: `attachment; filename="${filename}"`,
      type,
    });
  }
}