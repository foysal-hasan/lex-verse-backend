import { 
  Controller, 
  Post, 
  UseInterceptors, 
  UploadedFile, 
  Body, 
  UseGuards, 
  ParseFilePipe, 
  MaxFileSizeValidator, 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { FileUploadService } from './file-upload.service';


import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { TransformResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { UploadFileDto } from './dto/upload-file.dto';

@ApiTags('File Upload')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(TransformResponseInterceptor)
@Controller('upload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post('file') // Renamed route from 'image' to 'file'
  @ApiOperation({ summary: 'Upload any file format to a strategy-validated folder' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        folder: { type: 'string', example: 'legal-research' },
        file: { type: 'string', format: 'binary' },
      },
      required: ['folder', 'file'],
    },
  })
  @ApiResponse({ status: 201, description: 'File uploaded successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid folder name or payload error.' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // Size limit set to 25 MB for general files (adjust as needed)
          new MaxFileSizeValidator({ maxSize: 25 * 1024 * 1024 }), 
          
          // REMOVED: FileTypeValidator (allowing all extensions)
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() dto: UploadFileDto,
  ) {
    return this.fileUploadService.uploadFile(file, dto.folder);
  }
}