import {Module} from '@nestjs/common';
import {UserModule} from '../../modules/user/user.module';

@Module({
    controllers: [

    ],
    providers: [],
    exports: [],
    imports: [
        UserModule,
    ],
})
export class RoutesPublicModule {
}