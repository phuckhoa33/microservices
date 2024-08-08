import {Injectable, UnauthorizedException} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {ConfigService} from '@nestjs/config';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {
    }

    // This is simple validation, should be replaced with more complex validation.
    /**
     * Validate api key.
     * @param apiKey
     */
    public validateApiKey(apiKey: string): boolean {
        const key = this.configService.get<string>('auth.apiKey');
        return apiKey === key;
    }

    /**
     * Hash data.
     * @param data Data to hash.
     * @returns Promise<string> Hashed data.
     */
    public hashData(data: string): Promise<string> {
        return argon2.hash(data);
    }

    /**
     * Generate tokens.
     * @param payload
     * @returns {[accessToken, refreshToken]} Access token and refresh token.
     */
    public async generateTokens(payload: object): Promise<{
        accessToken: string;
        refreshToken: string;
    }> {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.configService.get('auth.accessTokenSecret'),
                expiresIn: this.configService.get('auth.accessTokenExpiresIn'),
            }),
            this.jwtService.signAsync(payload, {
                secret: this.configService.get('auth.refreshTokenSecret'),
                expiresIn: this.configService.get('auth.refreshTokenExpiresIn'),
            }),
        ]);

        return {
            accessToken,
            refreshToken,
        };
    }

    /**
     * Generate random password, password length is 8 by default.
     * @param length Password length.
     */
    public randomPassword(length: number = 8): string {
        const characters =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
        let result = '';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    /**
     * Validate user password.
     * @param password User password.
     * @param hashedPassword Hashed password.
     */
    public async validateUserPassword(
        password: string,
        hashedPassword: string,
    ): Promise<boolean> {
        return await argon2.verify(hashedPassword, password);
    }

    /**
     * Generate OTP.
     */
    public async generateOtp(): Promise<string> {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    /**
     * Verify and decode token.
     * @param token Token to verify and decode.
     */
    public async verifyAndDecodeToken(token: string): Promise<any> {
        const options = {
            secret: this.configService.get('auth.accessTokenSecret'),
        };

        try {
            return await this.jwtService.verifyAsync(token, options);
        } catch (error) {
            throw new UnauthorizedException(error.message);
        }
    }

    // Get principal from expired access token
    public async getPrincipalFromExpiredAccessToken(token: string): Promise<any> {
        const options = {
            secret: this.configService.get('auth.accessTokenSecret'),
            ignoreExpiration: true,
        };

        try {
            return await this.jwtService.verifyAsync(token, options);
        } catch (error) {
            throw new UnauthorizedException(error.message);
        }
    }

    // Compare password
    public async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
        return await argon2.verify(hashedPassword, password);
    }

    async isRefreshTokenHasExpired(refreshToken: string) {
        const options = {
            secret: this.configService.get('auth.refreshTokenSecret'),
            ignoreExpiration: false,
        };

        try {
            await this.jwtService.verifyAsync(refreshToken, options);
            return false;
        } catch (error) {
            return true;
        }
    }
}
