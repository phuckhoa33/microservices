import {registerAs} from '@nestjs/config';
import Joi from 'joi';

const schema = Joi.object({
    accessTokenSecret: Joi.string().required(),
    accessTokenExpiresIn: Joi.string().required(),
    refreshTokenSecret: Joi.string().required(),
    refreshTokenExpiresIn: Joi.string().required(),
});

export default registerAs('auth', () => {
    const config = {
        accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
        accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
        refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
        refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
    };

    const {error, value} = schema.validate(config);
    if (error) {
        throw new Error(`Config validation error: ${error.message}`);
    }

    return value;
});