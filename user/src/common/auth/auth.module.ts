import {DynamicModule, Module, Provider} from '@nestjs/common';
import {JwtModule} from '@nestjs/jwt';
import {AccessTokenStrategy} from './strategies/accessToken.strategy';
import {RefreshTokenStrategy} from './strategies/refreshToken.strategy';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {ApiKeyStrategy} from './strategies/apiKey.strategy';
import {AuthService} from './services/auth.service';
import {MongooseModule} from '@nestjs/mongoose';
import {PRIMARY_DATABASE_CONNECTION_NAME} from '../database/constants/database-name.constant';

@Module({
    providers: [AuthService],
    exports: [AuthService],
    controllers: [],
    imports: [
        JwtModule.registerAsync({
            inject: [ConfigService],
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('auth.accessTokenSecret'),
                signOptions: {
                    expiresIn: configService.get<string>('auth.accessTokenExpiresIn'),
                },
            }),
        }),
        MongooseModule.forFeature([], PRIMARY_DATABASE_CONNECTION_NAME),
    ],
})
export class AuthModule {
    static forRoot(): DynamicModule {
        const providers: Provider[] = [
            AccessTokenStrategy,
            RefreshTokenStrategy,
            ApiKeyStrategy,
        ];

        return {
            module: AuthModule,
            providers,
            exports: [],
            controllers: [],
            imports: [],
        };
    }
}
