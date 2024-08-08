import * as winston from 'winston';

export class ConsoleTransport {
    getInstance() {
        return new winston.transports.Console({
            format: winston.format.combine(
                winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
                winston.format.colorize(),
                winston.format.printf(({timestamp, level, message, meta: {context, trace}}) => {
                    const traceFormat = trace ? `\n${trace}` : '';
                    return `${timestamp} [${context}] ${level}: ${message}${traceFormat}`;
                }),
            ),
        });
    }
}