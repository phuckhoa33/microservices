import {PassportStrategy} from '@nestjs/passport';
import {Injectable, UnauthorizedException} from '@nestjs/common';
import {AuthService} from '../services/auth.service';
import {HeaderAPIKeyStrategy} from 'passport-headerapikey';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(
    HeaderAPIKeyStrategy,
    'api-key',
) {
    constructor(private authService: AuthService) {
        super({header: 'X-API-KEY', prefix: ''}, true, async (apiKey, done) => {
            if (this.authService.validateApiKey(apiKey)) {
                return done(null, true);
            }
            return done(new UnauthorizedException(), null);
        });
    }
}
