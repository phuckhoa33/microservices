import {Injectable} from '@nestjs/common';
import {MinioService} from 'nestjs-minio-client';
import {ConfigService} from '@nestjs/config';

@Injectable()
export class MinioClientService {
    constructor(
        private minioService: MinioService,
        private configService: ConfigService,
    ) {
    }

    // List all files in bucket
    async listFiles() {
        return new Promise((resolve, reject) => {
            const files = [];
            this.minioService.client.listObjects(this.configService.get('minio.bucketName'))
                .on('data', obj => {
                    files.push(obj);
                })
                .on('error', err => {
                    reject(err);
                })
                .on('end', () => {
                    resolve(files);
                });
        });
    }

    // Generate file URL, exapmle: http://localhost:9000/minio/bucketName/fileName, gen from endpoint, bucketName, fileName
    // getFileUrl(objectName: string) {
    //   const port = this.configService.get('minio.port') ? `:${this.configService.get('minio.port')}` : "";
    //   return `${this.configService.get('minio.useSSL') ? 'https' : 'http'}://${this.configService.get('minio.endPoint')}${port}/${this.configService.get('minio.bucketName')}/${objectName}`;
    // }

    // Get PUT presigned URL
    async getPresignedPutUrl(objectName: string) {
        return new Promise((resolve, reject) => {
            this.minioService.client.presignedPutObject(this.configService.get('minio.bucketName'), objectName, 24 * 60 * 60, (err, url) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(url);
                }
            });
        });
    }

    // Generate file URL, exapmle: http://localhost:9000/minio/bucketName/fileName, gen from endpoint, bucketName, fileName
    getFileUrl(objectName: string) {
        return `${this.configService.get('minio.useSSL') ? 'https' : 'http'}://${this.configService.get('minio.endPoint')}${this.configService.get('minio.port') ? `:${this.configService.get('minio.port')}` : ''}/${this.configService.get('minio.bucketName')}/${objectName}`;
    }

    // remove image file from bucket
    async removeObject(objectName: string) {
        await this.minioService.client.removeObject(this.configService.get('minio.bucketName'), objectName);
    }

    // Get POST preSigned URL, use policy to restrict file size and file type
    async getPreSignedPostUrl(objectName: string, contentType: string, contentLength: number) {
        return new Promise((resolve, reject) => {
            const policy = this.minioService.client.newPostPolicy();

            policy.setKey(objectName);
            policy.setBucket(this.configService.get('minio.bucketName'));
            //policy.setContentType(contentType);
            //policy.setContentLengthRange(0, contentLength);

            // const expires = new Date();
            // const configExpires = this.configService.get('minio.preSignedUrlExpires');
            // expires.setSeconds(expires.getSeconds() + configExpires);
            // policy.setExpires(expires);

            this.minioService.client.presignedPostPolicy(policy, (err, url) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(url);
                }
            });
        });
    }
}