import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LegalResearchService } from './legal-research.service';
import { CreateLegalResearchDto } from './dto/create-legal-research.dto';
import { UpdateLegalResearchDto } from './dto/update-legal-research.dto';

@Controller('legal-research')
export class LegalResearchController {
  constructor(private readonly legalResearchService: LegalResearchService) {}

  @Post()
  create(@Body() createLegalResearchDto: CreateLegalResearchDto) {
    return this.legalResearchService.create(createLegalResearchDto);
  }

  @Get()
  findAll() {
    return this.legalResearchService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.legalResearchService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLegalResearchDto: UpdateLegalResearchDto) {
    return this.legalResearchService.update(+id, updateLegalResearchDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.legalResearchService.remove(+id);
  }
}
