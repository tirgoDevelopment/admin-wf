import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadsController } from './upload.controller';

@Module({
    imports: [
      ],
      providers: [UploadService],
      controllers: [UploadsController],
      exports: [UploadService],
})
export class UploadModule {}
