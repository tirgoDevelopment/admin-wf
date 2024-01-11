import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import * as multer from 'multer';
import * as multerS3 from 'multer-s3';

AWS.config.update({
    accessKeyId: 'AKIAS4ZF5MI2GAD3FMUQ',
    secretAccessKey: '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',
    region: 'us-east-1'
});

@Injectable()
export class UploadService {

 private readonly s3Client = new AWS.S3()
    constructor() { }

//     storage = multerS3({
//         s3: this.s3Client,
//         bucket: 'tirgo-bucket',
//         acl: 'public-read', // Adjust permissions as needed
//         key: (req, file, cb) => {
//           const fileName = `${Date.now()}_${file.originalname}`;
//           cb(null, `images/${fileName}`);
//         },
//       });
      
//       upload = multer({ storage: this.storage });
      

//     async uploadFile(file: any) {
//         const params = {
//             Bucket: 'tirgo-bucket',
//             Key: 'images',
//             Body: file
//         }
//         this.s3Client.upload(params, (err: any, data: any) => {
//             if(err) {
//                 console.log(err)
//             } 
//             console.log('DATA', data)
//         });
//         return true
//     }
}