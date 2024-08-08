import {HttpStatus, Injectable, NestMiddleware} from '@nestjs/common';
import {NextFunction, Request, Response} from 'express';
import {ConfigService} from '@nestjs/config';
import cors from 'cors';

@Injectable()
export class CorsMiddleware implements NestMiddleware {
    private readonly allowOrigin: string | boolean | string[];
    private readonly allowMethod: string[];
    private readonly allowHeader: string[];

    constructor(private readonly configService: ConfigService) {
        this.allowOrigin = this.configService.get<string | boolean | string[]>(
            'middleware.cors.allowOrigin',
        );
        this.allowMethod = this.configService.get<string[]>(
            'middleware.cors.allowMethod',
        );
        this.allowHeader = this.configService.get<string[]>(
            'middleware.cors.allowHeader',
        );
    }

    use(req: Request, res: Response, next: NextFunction): void {
        const corsOptions: cors.CorsOptions = {
            origin: this.allowOrigin,
            methods: this.allowMethod,
            allowedHeaders: this.allowHeader,
            preflightContinue: false,
            credentials: true,
            optionsSuccessStatus: HttpStatus.NO_CONTENT,
        };

        cors(corsOptions)(req, res, next);
    }
}
