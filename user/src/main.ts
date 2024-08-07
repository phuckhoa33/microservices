import {NestFactory} from '@nestjs/core';
import {AppModule} from './app/app.module';
import * as process from 'process';
import swaggerInit, {ISwaggerOptions} from './swagger';
import {Logger, VersioningType} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    // Get environment variables
    const appEnv = configService.get<string>('app.env');
    const appPort = configService.get<number>('app.port');
    const appName = configService.get<string>('app.name');
    const appVersion = configService.get<string>('app.version');
    const appDescription = configService.get<string>('app.description');
    const swaggerEnable = configService.get<boolean>('app.swagger.enable');
    const apiGlobalPrefix = configService.get<string>('app.globalPrefix');

    const logger = new Logger();
    process.env.NODE_ENV = appEnv;
    // Set app timezone to UTC, all date will be in UTC, good for storing in database and processing
    process.env.TZ = 'UTC';

    // Prefix api
    app.setGlobalPrefix(apiGlobalPrefix);

    // Versioning
    app.enableVersioning({
        type: VersioningType.URI,
        prefix: 'v',
    });

    // If env is development, enable swagger
    if (swaggerEnable) {
        const swaggerOptions: ISwaggerOptions = {
            title: appName || 'API Documentation',
            description: appDescription || 'API Documentation',
            version: appVersion || '1.0',
        };

        swaggerInit(app, swaggerOptions);
    }

    await app.listen(appPort || 3000);

    const instanceName = 'NestApplication';
    const appUrl = await app.getUrl();

    logger.log('==========================================================');
    logger.log(`Environment Variables`, instanceName);
    logger.log(`APP_NAME: ${appName}`, instanceName);
    logger.log(`APP_ENV: ${appEnv}`, instanceName);
    logger.log('==========================================================');
    logger.log(`Server is running on: ${appUrl}`, instanceName);
    if (swaggerEnable) {
        logger.log(`Swagger is running on: ${appUrl}/docs`, instanceName);
    } else {
        logger.log(`Swagger is disabled`, instanceName);
    }
}

bootstrap();