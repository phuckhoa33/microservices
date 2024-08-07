import {registerAs} from '@nestjs/config';
import * as process from 'process';
import bytes from 'bytes';
import ms from 'ms';
import Joi from 'joi';

// In environment, it like as
//ALLOW_ORIGIN="http://localhost:3000,https://localhost:3000,http://localhost:4000,https://localhost:4000,http://localhost:4001,https://localhost:4001,http://localhost:4002,https://localhost:4002,http://localhost:4003,https://localhost:4003"
// Write schema suitable for this config
const schema = Joi.object({
    body: Joi.object({
        json: Joi.object({
            maxFileSize: Joi.number().required(),
        }).required(),
        raw: Joi.object({
            maxFileSize: Joi.number().required(),
        }).required(),
        text: Joi.object({
            maxFileSize: Joi.number().required(),
        }).required(),
        urlencoded: Joi.object({
            maxFileSize: Joi.number().required(),
        }).required(),
    }).required(),
    timeout: Joi.number().required(),
    cors: Joi.object({
        allowMethod: Joi.array().items(Joi.string()),
        allowOrigin: Joi.array().items(Joi.string()).required(),
        allowHeader: Joi.array().items(Joi.string()),
    }).required(),
    throttle: Joi.object({
        ttl: Joi.number().required(),
        limit: Joi.number().required(),
    }).required(),
});

export default registerAs(
    'middleware',
    (): Record<string, any> => {
        const config = {
            body: {
                json: {
                    maxFileSize: bytes('100kb'), // 100kb
                },
                raw: {
                    maxFileSize: bytes('100kb'), // 100kb
                },
                text: {
                    maxFileSize: bytes('100kb'), // 100kb
                },
                urlencoded: {
                    maxFileSize: bytes('100kb'), // 100kb
                },
            },
            timeout: ms('30s'), // 30s based on ms module
            cors: {
                allowMethod: [
                    'GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD',
                ],
                allowOrigin: process.env.ALLOW_ORIGIN
                    ? process.env.ALLOW_ORIGIN.split(',')
                    : '*',
                // allowOrigin: [/example\.com(\:\d{1,4})?$/], // allow all subdomain, and all port
                // allowOrigin: [/example\.com$/], // allow all subdomain without port
                allowHeader: [
                    'Accept',
                    'Accept-Language',
                    'Content-Language',
                    'Content-Type',
                    'Origin',
                    'Authorization',
                    'Access-Control-Request-Method',
                    'Access-Control-Request-Headers',
                    'Access-Control-Allow-Headers',
                    'Access-Control-Allow-Origin',
                    'Access-Control-Allow-Methods',
                    'Access-Control-Allow-Credentials',
                    'Access-Control-Expose-Headers',
                    'Access-Control-Max-Age',
                    'Referer',
                    'Host',
                    'X-Requested-With',
                    'x-custom-lang',
                    'x-timestamp',
                    'x-api-key',
                    'x-timezone',
                    'X-Lang',
                    'x-request-id',
                    'x-version',
                    'x-repo-version',
                    'X-Response-Time',
                    'user-agent',
                    'x-locale',
                    'x-device-id',
                ],
            },
            throttle: {
                ttl: ms('500'), // 0.5 secs
                limit: 10, // max request per reset time
            },
        };

        const {error, value} = schema.validate(config);
        if (error) {
            throw new Error(`Config validation error: ${error.message}`);
        }

        return value;
    },
);
