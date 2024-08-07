import {Catch, ExceptionFilter, HttpException, HttpStatus} from '@nestjs/common';
import * as os from 'node:os';
import {LoggerService} from '../../common/logger/services/logger.service';

@Catch()
export class AppHttpFilter implements ExceptionFilter {
    constructor(
        private readonly logger: LoggerService,
    ) {
    }

    catch(exception: any, host: any) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const path = request.url;
        const method = request.method;
        const hostName = request.headers.host || request.hostname || os.hostname();
        const ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress || null;
        const message = exception?.response?.message || exception.message || exception;

        const logMetadata = {
            context: 'ErrorHttpFilter',
            trace: exception.stack,
            ip: ip,
            method: method,
            hostName: hostName,
            path: path,
            header: JSON.stringify(request.headers, null, 2),
            body: JSON.stringify(request.body, null, 2),
        };

        // Check if exception is instance of HttpException
        if (!(exception instanceof HttpException)) {
            // If not instance of HttpException, then it is a system error
            // Log the error
            this.logger.error(message, logMetadata);

            // Return error to client
            return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Internal server error',
            });
        }

        // If instance of HttpException, then it is a client error
        // Log the error if debug mode is enabled
        this.logger.log(message, 'ErrorHttpFilter');

        // Return error to client
        return response.status(exception.getStatus()).json({
            statusCode: exception.getStatus(),
            message: message,
            timestamp: new Date().toISOString(),
            path: request.url,
        });
    }
}