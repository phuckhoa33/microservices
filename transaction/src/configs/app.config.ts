import {registerAs} from '@nestjs/config';
import {AppEnvironmentEnum} from '../app/constants/app.environment.enum';
import Joi from 'joi';

const schema = Joi.object({
    name: Joi.string().required(),
    env: Joi.string().valid(...Object.values(AppEnvironmentEnum)).required(),
    version: Joi.string().required(),
    globalPrefix: Joi.string().required(),
    port: Joi.number().required(),
    swagger: Joi.object({
        enable: Joi.boolean().required(),
        account: Joi.string().required(),
        password: Joi.string().required(),
    }).required(),
    loggers: Joi.object({
        slack: Joi.object({
            enable: Joi.boolean().required(),
        }).required(),
    }).required(),
});

export default registerAs('app', () => {
    const config = {
        name: process.env.APP_NAME,
        env: process.env.APP_ENV,
        version: process.env.APP_VERSION,
        globalPrefix: process.env.APP_API_PREFIX,
        port: process.env.APP_PORT,
        swagger: {
            enable: process.env.SWAGGER_ENABLE,
            account: process.env.SWAGGER_ACCOUNT,
            password: process.env.SWAGGER_PASSWORD,
        },
        loggers: {
            slack: {
                enable: process.env.SLACK_NOTIFICATION_ENABLE,
            },
        },
    };

    const {error, value} = schema.validate(config);
    if (error) {
        throw new Error(`Config validation error: ${error.message}`);
    }

    return value;
});