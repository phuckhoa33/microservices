import * as winston from 'winston';
import {LoggerOptions} from 'winston';
import {AppEnvironmentEnum} from '../../../app/constants/app.environment.enum';
import {ConsoleTransport} from '../transports/console.transport';
import {DailyRotateFileTransport} from '../transports/daily-rotate-file.transport';
import {MongoDBTransport} from '../transports/mongodb.transport';
import {SlackHookTransport} from '../transports/slack-hook.transport';
import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';

@Injectable()
export class LoggerOptionsService {
    constructor(
        private readonly configService: ConfigService,
    ) {
    }

    createLogger(): LoggerOptions {
        const appEnv = this.configService.get<string>('app.env');
        const slackEnable = this.configService.get<boolean>('app.loggers.slack.enable');
        let transports: winston.transport[];
        let level: string;
        switch (appEnv) {
            case AppEnvironmentEnum.DEVELOPMENT: {
                transports = [
                    new ConsoleTransport().getInstance(),
                    new DailyRotateFileTransport().getInstance(),
                    new MongoDBTransport().getInstance(),
                ];
                level = 'debug';
                break;
            }
            case AppEnvironmentEnum.STAGING:
            case AppEnvironmentEnum.PRODUCTION: {
                transports = [
                    new ConsoleTransport().getInstance(),
                    new DailyRotateFileTransport().getInstance(),
                    new MongoDBTransport().getInstance(),
                ];

                if (slackEnable) {
                    transports.push(new SlackHookTransport().getInstance());
                }

                level = 'info';
                break;
            }
            default:
                throw new Error(`Unsupported environment: ${appEnv}`);
        }

        return winston.createLogger({
            level: level,
            transports: transports,
        });
    }
}