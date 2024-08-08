import {CorsMiddleware} from './middlewares/cors.middleware';
import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import {HelmetMiddleware} from './middlewares/helmet.middleware';
import {APP_FILTER, APP_GUARD} from '@nestjs/core';
import {AppHttpFilter} from './filters/app.http.filter';
import {LoggerService} from '../common/logger/services/logger.service';
import {ResponseTimeMiddleware} from './middlewares/response-time.middleware';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {ThrottlerGuard, ThrottlerModule, ThrottlerModuleOptions} from '@nestjs/throttler';

@Module({
    controllers: [],
    exports: [],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
        {
            provide: APP_FILTER,
            useClass: AppHttpFilter,
        },
        LoggerService,
    ],
    imports: [
        ThrottlerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService): ThrottlerModuleOptions => ({
                throttlers: [
                    {
                        ttl: config.get('middleware.throttle.ttl'),
                        limit: config.get('middleware.throttle.limit'),
                    },
                ],
            }),
        }),
    ],
})
export class AppMiddlewareModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(
                HelmetMiddleware,
                CorsMiddleware,
                // JsonBodyParserMiddleware,
                // TextBodyParserMiddleware,
                // RawBodyParserMiddleware,
                // UrlencodedBodyParserMiddleware,
                ResponseTimeMiddleware,
            )
            .forRoutes('*');
    }
}