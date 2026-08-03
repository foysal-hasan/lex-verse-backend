export interface FolderStrategy {
  validate(folderName: string): boolean;
  getAllowedFolders(): string[];
}