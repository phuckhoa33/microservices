import {registerAs} from '@nestjs/config';
import Joi from 'joi';
import * as process from 'node:process';

const schema = Joi.object({
    endPoint: Joi.string().required(),
    useSSL: Joi.boolean().required(),
    accessKey: Joi.string().required(),
    secretKey: Joi.string().required(),
    bucketName: Joi.string().required(),
    preSignedUrlExpires: Joi.number().integer().min(0).required(),
});

export default registerAs('minio', () => {
    const config = {
        endPoint: process.env.MINIO_ENDPOINT,
        useSSL: process.env.MINIO_USE_SSL === 'true',
        accessKey: process.env.MINIO_ACCESS_KEY,
        secretKey: process.env.MINIO_SECRET_KEY,
        bucketName: process.env.MINIO_BUCKET_NAME,
        preSignedUrlExpires: parseInt(process.env.MINIO_PRESIGNED_URL_EXPIRES, 10),
    };

    const {error, value} = schema.validate(config);
    if (error) {
        throw new Error(`Config validation error: ${error.message}`);
    }

    return value;
});