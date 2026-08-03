import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  StreamableFile,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { QuestionBankService } from '../question-bank.service';
import { QueryQuestionBankDto } from '../dto/query-question-bank.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from 'src/modules/auth/guards/optional-jwt-auth.guard';

@ApiTags('User - Question Banks')
@Controller('question-banks')
export class QuestionBankUserController {
  constructor(private readonly questionBankService: QuestionBankService) {}

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'List published Question Banks with search, filters, & unlock status' })
  async findAll(@Query() query: QueryQuestionBankDto, @Req() req: any) {
    const userId = req.user?.id;
    return this.questionBankService.findAll(query, userId, false);
  }

  @Get('programs/unique')
  @ApiOperation({ summary: 'Get list of unique program types' })
  async getProgramTypes() {
    return this.questionBankService.getUniqueProgramTypes();
  }

  @Get('exams/unique')
  @ApiOperation({ summary: 'Get list of unique exam types' })
  async getExamTypes() {
    return this.questionBankService.getUniqueExamTypes();
  }

  @Get('subjects/unique')
  @ApiOperation({ summary: 'Get list of unique subjects' })
  async getSubjects() {
    return this.questionBankService.getUniqueSubjects();
  }

  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get details of a Question Bank' })
  async findOne(@Param('id') id: string, @Req() req: any) {
    const userId = req.user?.id;
    return this.questionBankService.findOne(id, userId, false);
  }

  @Get(':id/download')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Download Question Bank PDF file' })
  async downloadPdf(@Param('id') id: string, @Req() req: any): Promise<StreamableFile> {
    const userId = req.user.id;
    const { stream, filename, type } = await this.questionBankService.getDownloadStream(
      id,
      userId,
    );

    return new StreamableFile(stream, {
      disposition: `attachment; filename="${filename}"`,
      type,
    });
  }
}