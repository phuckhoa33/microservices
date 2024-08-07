import {DynamicModule, ForwardReference, Module, Type} from '@nestjs/common';
import {RouterModule as NestJsRouterModule} from '@nestjs/core';
import {RoutesPublicModule} from './routes/routes.public.module';
import {RoutesInternalModule} from './routes/routes.internal.module';

@Module({})
export class RouterModule {
    static forRoot(): DynamicModule {
        const imports: (
            | DynamicModule
            | Type<any>
            | Promise<DynamicModule>
            | ForwardReference<any>
            )[] = [];

        imports.push(
            RoutesPublicModule,
            RoutesInternalModule,
            NestJsRouterModule.register([
                {
                    path: '/public',
                    module: RoutesPublicModule,
                },
                {
                    path: '/internal',
                    module: RoutesInternalModule,
                },
            ]),
        );

        return {
            module: RouterModule,
            providers: [],
            exports: [],
            controllers: [],
            imports,
        };
    }
}
