import {Module} from '@nestjs/common';
import {CommonModule} from '../common/common.module';
import {AutomapperModule} from '@automapper/nestjs';
import {classes} from '@automapper/classes';
import {RouterModule} from '../router/router.module';
import {AppMiddlewareModule} from './app.middleware.module';

@Module({
    imports: [
        AppMiddlewareModule,
        AutomapperModule.forRoot({
            strategyInitializer: classes(),
        }),
        CommonModule,
        RouterModule.forRoot(),
    ],
    controllers: [],
    providers: [],
})
export class AppModule {
}
