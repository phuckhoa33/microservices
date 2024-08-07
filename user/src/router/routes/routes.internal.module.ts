import {Module} from '@nestjs/common';
import {RoleModule} from '../../modules/role/role.module';
import {HealthController} from '../../health/controllers/health.controller';
import {HealthModule} from '../../health/health.module';
import {TerminusModule} from '@nestjs/terminus';
import {UserModule} from '../../modules/user/user.module';
import {UserAuthV1Controller} from '../../modules/user/controllers/user.auth.v1.controller';
import {UserMeV1Controller} from '../../modules/user/controllers/user.me.v1.controller';
import {UserQrLoginV1Controller} from '../../modules/user/controllers/user-qr-login.v1.controller';
import {TransactionModule} from "../../modules/transaction/transaction.module";
import {
    InvestorTransactionV1Controller
} from "../../modules/transaction/controller/v1/investor-transaction.v1.controller";
import {WalletModule} from "../../modules/wallet/wallet.module";
import {InvestorWalletV1Controller} from "../../modules/wallet/controller/v1/investor-wallet.v1.controller";

@Module({
    controllers: [
        HealthController,
        UserAuthV1Controller,
        UserMeV1Controller,
        UserQrLoginV1Controller,
        InvestorTransactionV1Controller,
        InvestorWalletV1Controller,
    ],
    providers: [],
    exports: [],
    imports: [
        HealthModule,
        RoleModule,
        TerminusModule,
        UserModule,
        TransactionModule,
        WalletModule,
    ],
})
export class RoutesInternalModule {

}