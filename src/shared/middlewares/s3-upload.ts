// src/shared/middlewares/s3-upload.ts
import * as multerS3 from 'multer-s3';
import { s3 } from '../configs/aws-config';

const s3Storage = multerS3({
    s3: s3,
    bucket: 'tirgo-bucket',
    key: (req, file, cb) => {
        const fileName = `${Date.now()}_${file.originalname}`;
        cb(null, `images/${fileName}`); // Adjust the path as needed
        console.log('keldi', file);
    },
});
export const uploadConfig = { storage: s3Storage };

