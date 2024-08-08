import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import {INestApplication} from '@nestjs/common';
import {ParameterObject} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import {SwaggerTheme, SwaggerThemeNameEnum} from 'swagger-themes';
import {ConfigService} from '@nestjs/config';
import expressBasicAuth from 'express-basic-auth';

export const SWAGGER_PATH = '/docs';

export interface ISwaggerOptions {
    title: string;
    description: string;
    version: string;
}

export default function (app: INestApplication, options: ISwaggerOptions) {
    const swaggerConfigs = app.get(ConfigService);
    const swaggerAccount = swaggerConfigs.get<string>('app.swagger.account');
    const swaggerPassword = swaggerConfigs.get<string>('app.swagger.password');

    // Use password to access the Swagger UI
    app.use([SWAGGER_PATH, `${SWAGGER_PATH}-json`], expressBasicAuth(
        {
            users: {[swaggerAccount]: swaggerPassword},
            challenge: true,
        },
    ));

    const languageHeader: ParameterObject = {
        name: 'x-lang',
        in: 'header',
        description: 'Language',
        required: false,
        schema: {
            type: 'string',
            default: 'vi',
            enum: ['vi', 'en'],
        },
    };

    const deviceIDHeader: ParameterObject = {
        name: 'x-device-id',
        in: 'header',
        description: 'Device ID',
        required: false,
        schema: {
            type: 'string',
            default: '',
        },
    };

    const globalParameters: ParameterObject[] = [];
    globalParameters.push(languageHeader, deviceIDHeader);

    const documentBuilder = new DocumentBuilder()
        .setTitle(options.title)
        .setDescription(options.description)
        .setVersion('1.0')
        .addBearerAuth()
        .addGlobalParameters(...globalParameters)
        .build();

    const document = SwaggerModule.createDocument(app, documentBuilder);

    const theme = new SwaggerTheme();
    const themeOptions = {
        explorer: true,
        customCss: theme.getBuffer(SwaggerThemeNameEnum.DARK),
        languageHeader,
    };

    SwaggerModule.setup(SWAGGER_PATH, app, document, {
        ...themeOptions,
        swaggerOptions: {
            persistAuthorization: true,
            displayRequestDuration: true,
            displayOperationId: true,
            filter: true,
            syntaxHighlight: {
                activate: true,
                theme: 'arta',
            },
        },
    });
}
