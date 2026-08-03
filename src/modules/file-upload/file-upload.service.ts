import { Injectable, BadRequestException } from '@nestjs/common';
import { AllowedFoldersStrategy } from './strategies/allowed-folders.strategy';
import { PrismaService } from 'src/prisma/prisma.service';
import appConfig from 'src/config/app.config';
import { Storage } from 'src/common/lib/Disk/Storage';
import { extname } from 'path';

@Injectable()
export class FileUploadService {
  constructor(
    private readonly folderStrategy: AllowedFoldersStrategy,
    private readonly prisma: PrismaService,
  ) {}

  async uploadFile(file: Express.Multer.File, folder: string) {
    if (!file) throw new BadRequestException('File file is required');

    // 1. Execute Folder Strategy Validation
    this.folderStrategy.validate(folder);

    const generatedFilename = `${Date.now()}-${Math.random().toString(32).slice(2)}${extname(file.originalname)}`;
    const key = `${folder}/${generatedFilename}`;

    await Storage.put(key, file.buffer);

    const fileUrl = Storage.url(`/${key}`);

    // 3. Register file entry in DB as PENDING
    await this.prisma.fileUpload.create({
      data: {
        url: fileUrl,
        folder,
        file_path: key,
        status: 'PENDING',
      },
    });

    return {
      filename: file.originalname,
      path: key,
      url: fileUrl,
    };
  }
}