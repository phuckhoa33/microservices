import {Injectable} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {ExtractJwt, Strategy} from 'passport-jwt';
import {ConfigService} from '@nestjs/config';
import {AuthService} from '../services/auth.service';

type JwtPayload = {
    username: string;
    sub: string;
};

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        private readonly authService: AuthService,
        private configService: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get('auth.accessTokenSecret'),
            ignoreExpiration: false,
            jsonWebTokenOptions: {
                ignoreNotBefore: false,
            },
        });
    }

    async validate(payload: JwtPayload) {
        return payload;
    }
}
