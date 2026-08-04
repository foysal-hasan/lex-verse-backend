import { PartialType } from '@nestjs/swagger';
import { CreateQuestionBankPurchaseDto } from './create-question-bank-purchase.dto';

export class UpdateQuestionBankPurchaseDto extends PartialType(CreateQuestionBankPurchaseDto) {}
