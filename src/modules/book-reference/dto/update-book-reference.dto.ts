import { PartialType } from '@nestjs/swagger';
import { CreateBookReferenceDto } from './create-book-reference.dto';

export class UpdateBookReferenceDto extends PartialType(CreateBookReferenceDto) {}
