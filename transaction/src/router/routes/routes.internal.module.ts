import {Module} from '@nestjs/common';
import {HealthController} from '../../health/controllers/health.controller';
import {HealthModule} from '../../health/health.module';
import {TerminusModule} from '@nestjs/terminus';
import {TransactionModule} from "../../modules/transaction/transaction.module";
import {
    InvestorTransactionV1Controller
} from "../../modules/transaction/controller/v1/investor-transaction.v1.controller";
import {WalletModule} from "../../modules/wallet/wallet.module";
import {InvestorWalletV1Controller} from "../../modules/wallet/controller/v1/investor-wallet.v1.controller";

@Module({
    controllers: [
        HealthController,
        InvestorTransactionV1Controller,
        InvestorWalletV1Controller,
    ],
    providers: [],
    exports: [],
    imports: [
        HealthModule,
        TerminusModule,
        TransactionModule,
        WalletModule,
    ],
})
export class RoutesInternalModule {

}