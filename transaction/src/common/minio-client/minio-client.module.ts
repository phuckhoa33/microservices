import {Module} from '@nestjs/common';
import {MinioModule} from 'nestjs-minio-client';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {MinioClientService} from './services/minio-client.service';

@Module({
    imports: [
        MinioModule.registerAsync({
            inject: [ConfigService],
            imports: [ConfigModule],
            useFactory: (config: ConfigService) => ({
                endPoint: config.get('minio.endPoint'),
                useSSL: config.get('minio.useSSL'),
                accessKey: config.get('minio.accessKey'),
                secretKey: config.get('minio.secretKey'),
                bucketName: config.get('minio.bucketName'),
            }),
        }),
    ],
    controllers: [],
    providers: [MinioClientService],
    exports: [MinioClientService],
})
export class MinioClientModule {

}