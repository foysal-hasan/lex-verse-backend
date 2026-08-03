import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { QuestionBankService } from '../question-bank.service';
import { CreateQuestionBankDto } from '../dto/create-question-bank.dto';
import { UpdateQuestionBankDto } from '../dto/update-question-bank.dto';
import { QueryQuestionBankDto } from '../dto/query-question-bank.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guard/role/roles.guard';
import { Roles } from 'src/common/guard/role/roles.decorator';
import { UserRole } from 'src/generated/prisma/enums';


@ApiTags('Admin - Question Banks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.admin)
@Controller('admin/question-banks')
export class QuestionBankAdminController {
  constructor(private readonly questionBankService: QuestionBankService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new Question Bank entry' })
  async create(@Body() createDto: CreateQuestionBankDto) {
    return this.questionBankService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all Question Banks including unpublished ones' })
  async findAll(@Query() query: QueryQuestionBankDto) {
    return this.questionBankService.findAll(query, undefined, true);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a Question Bank (Admin)' })
  async findOne(@Param('id') id: string) {
    return this.questionBankService.findOne(id, undefined, true);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update Question Bank entry' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateQuestionBankDto,
  ) {
    return this.questionBankService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a Question Bank entry' })
  async remove(@Param('id') id: string, @Req() req: any) {
    const adminUserId = req.user?.id || 'system_admin';
    return this.questionBankService.remove(id, adminUserId);
  }
}