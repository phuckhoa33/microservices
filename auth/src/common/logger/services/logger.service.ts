import {Inject, Injectable} from '@nestjs/common';
import {WINSTON_MODULE_PROVIDER} from 'nest-winston';
import {Logger} from 'winston';

interface LogMetadata {
    context?: string;
    trace?: string;
    ip?: string;
    method?: string;
    hostName?: string;
    path?: string;
    header?: string;
    body?: string;
}

@Injectable()
export class LoggerService {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER)
        private readonly logger: Logger,
    ) {
    }

    log(message: string, context?: string) {
        this.logger.info(message, {meta: {context}});
    }

    error(message: string, metadata: LogMetadata) {
        this.logger.error(message, {meta: metadata});
    }

    warn(message: string, context?: string) {
        this.logger.warn(message, {context});
    }

    debug(message: string, context?: string) {
        this.logger.debug(message, {meta: {context: context}});
    }
}