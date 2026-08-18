import { PartialType } from '@nestjs/swagger';
import { CreateWrittenExamDto } from './create-written-exam.dto';


export class UpdateWrittenExamDto extends PartialType(CreateWrittenExamDto) {}