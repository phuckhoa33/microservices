import {Module} from '@nestjs/common';
import {LoggerOptionsService} from './services/logger.options.service';

@Module({
    providers: [LoggerOptionsService],
    exports: [LoggerOptionsService],
    imports: [],
})
export class LoggerOptionModule {

}