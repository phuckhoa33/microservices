import {Module} from '@nestjs/common';
import {RoleModule} from '../../modules/role/role.module';
import {HealthController} from '../../health/controllers/health.controller';
import {HealthModule} from '../../health/health.module';
import {TerminusModule} from '@nestjs/terminus';
import {UserAuthV1Controller} from '../../modules/user/controllers/user.auth.v1.controller';
import {UserQrLoginV1Controller} from '../../modules/user/controllers/user-qr-login.v1.controller';
import { UserModule } from 'src/modules/user/user.module';

@Module({
    controllers: [
        HealthController,
        UserAuthV1Controller,
        UserQrLoginV1Controller,
    ],
    providers: [],
    exports: [],
    imports: [
        HealthModule,
        RoleModule,
        TerminusModule,
        UserModule
    ],
})
export class RoutesInternalModule {

}