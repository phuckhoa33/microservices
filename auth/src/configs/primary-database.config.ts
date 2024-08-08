import {registerAs} from '@nestjs/config';
import Joi from 'joi';
import {PRIMARY_DATABASE_CONNECTION_NAME} from '../common/database/constants/database-name.constant';
import * as process from 'node:process';

const schema = Joi.object({
    host: Joi.string().required(),
    name: Joi.string().required(),
    user: Joi.string().required(),
    password: Joi.string().required(),
    debug: Joi.boolean().required(),
    options: Joi.string().required(),
});

export default registerAs(PRIMARY_DATABASE_CONNECTION_NAME, () => {
    const config = {
        host: process.env.DATABASE_HOST,
        name: process.env.DATABASE_NAME,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        debug: process.env.DATABASE_DEBUG === 'true',
        options: process.env.DATABASE_OPTIONS,
    };

    const {error, value} = schema.validate(config);
    if (error) {
        throw new Error(`Config validation error: ${error.message}`);
    }

    return value;
});