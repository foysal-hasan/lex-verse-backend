import { Module } from '@nestjs/common';
import { SuggestionService } from './suggestion.service';
import { SuggestionAdminController } from './controllers/suggestion-admin.controller';
import { SuggestionUserController } from './controllers/suggestion-user.controller';

@Module({
  controllers: [SuggestionAdminController, SuggestionUserController],
  providers: [SuggestionService],
})
export class SuggestionModule {}
