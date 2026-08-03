import { PartialType } from '@nestjs/swagger';
import { CreateBareActDto } from './create-bare-act.dto';

export class UpdateBareActDto extends PartialType(CreateBareActDto) {}
