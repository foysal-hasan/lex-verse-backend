import { OmitType } from '@nestjs/swagger';
import { QueryRoutineUserDto } from './query-routine-user.dto';

export class PinnedQueryRoutineUserDto extends OmitType(QueryRoutineUserDto, ['page', 'limit']) {
}