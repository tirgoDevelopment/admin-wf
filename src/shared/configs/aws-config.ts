// src/shared/aws-config.ts
import * as AWS from 'aws-sdk';

AWS.config.update({
    accessKeyId: 'AKIAS4ZF5MI2GAD3FMUQ',
    secretAccessKey: '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',
    region: 'ap-south-1', // Use the correct region code
});

export const s3 = new AWS.S3();
