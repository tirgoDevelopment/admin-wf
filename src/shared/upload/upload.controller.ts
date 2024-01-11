// src/shared/uploads/controller.ts
import { Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { uploadConfig } from '../middlewares/s3-upload';  // Import middleware

@Controller('api/v2/files')
export class UploadsController {
  constructor(private uploadService: UploadService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', uploadConfig))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log('file', file);
    // this.uploadService.uploadFile(file)
  }
}
