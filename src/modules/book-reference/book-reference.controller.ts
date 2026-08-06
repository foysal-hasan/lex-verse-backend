import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BookReferenceService } from './book-reference.service';
import { CreateBookReferenceDto } from './dto/create-book-reference.dto';
import { UpdateBookReferenceDto } from './dto/update-book-reference.dto';

@Controller('book-reference')
export class BookReferenceController {
  constructor(private readonly bookReferenceService: BookReferenceService) {}

  @Post()
  create(@Body() createBookReferenceDto: CreateBookReferenceDto) {
    return this.bookReferenceService.create(createBookReferenceDto);
  }

  @Get()
  findAll() {
    return this.bookReferenceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookReferenceService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookReferenceDto: UpdateBookReferenceDto) {
    return this.bookReferenceService.update(+id, updateBookReferenceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookReferenceService.remove(+id);
  }
}
