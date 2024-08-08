import {Module} from '@nestjs/common';
import {LoggerService} from './services/logger.service';
import {WinstonModule} from 'nest-winston';
import {LoggerOptionsService} from './services/logger.options.service';
import {LoggerOptionModule} from './logger.option.module';

@Module({
    imports: [
        WinstonModule.forRootAsync({
            inject: [LoggerOptionsService],
            imports: [LoggerOptionModule],
            useFactory: (loggerOptionsService: LoggerOptionsService) => loggerOptionsService.createLogger(),
        }),
    ],
    controllers: [],
    providers: [LoggerService],
    exports: [LoggerService],
})
export class LoggerModule {
}