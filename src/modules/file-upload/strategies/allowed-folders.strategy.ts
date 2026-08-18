import { Injectable, BadRequestException } from '@nestjs/common';
import { FolderStrategy } from '../interfaces/folder-strategy.interface';

export enum AllowedUploadFolders {
  LEGAL_RESEARCH = 'legal-research',
  LEGAL_DICTIONARY = 'legal-dictionary',
  QUIZZES = 'quizzes',
  PACKAGES = 'packages',
  BARE_ACTS = 'bare-acts',
  ARTICLES = 'articles',
  NOTES = 'notes',
  SYLLABUS = 'syllabus',
  ROUTINES = 'routines',
  EXAMS = 'exams'
}

@Injectable()
export class AllowedFoldersStrategy implements FolderStrategy {
  private readonly allowedFolders: string[] = Object.values(AllowedUploadFolders);

  validate(folderName: string): boolean {
    if (!this.allowedFolders.includes(folderName)) {
      throw new BadRequestException(
        `Invalid upload folder '${folderName}'. Allowed options: ${this.allowedFolders.join(', ')}`,
      );
    }
    return true;
  }

  getAllowedFolders(): string[] {
    return this.allowedFolders;
  }
}