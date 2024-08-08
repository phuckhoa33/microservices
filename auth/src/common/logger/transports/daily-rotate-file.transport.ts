import * as winston from 'winston';
import 'winston-daily-rotate-file';

export class DailyRotateFileTransport {
    getInstance() {
        return new winston.transports.DailyRotateFile({
            level: 'info',
            filename: 'logs/application-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.printf(({timestamp, level, message, meta: {context, trace}}) => {
                    return `${timestamp} [${context}] ${level}: ${message}${trace ? `\n${trace}` : ''}`;
                }),
            ),
        });
    }
}