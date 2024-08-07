import {Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import {TransactionEntity, TransactionSchema} from "./entities/transaction.entity";
import {InvestorEntity, InvestorSchema} from "../user/entities/investor.entity";
import {WalletEntity, WalletSchema} from "../wallet/entities/wallet.entity";
import {PRIMARY_DATABASE_CONNECTION_NAME} from "../../common/database/constants/database-name.constant";
import {PaginationModule} from "../../common/pagination/pagination.module";
import {TransactionProfile} from "./profile/transaction.profile";
import {InvestorTransactionService} from "./services/investor-transaction.service";

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: TransactionEntity.name,
                schema: TransactionSchema
            },
            {
                name: InvestorEntity.name,
                schema: InvestorSchema
            },
            {
                name: WalletEntity.name,
                schema: WalletSchema
            },
        ], PRIMARY_DATABASE_CONNECTION_NAME),
        PaginationModule
    ],
    providers: [TransactionProfile, InvestorTransactionService],
    exports: [InvestorTransactionService]
})
export class TransactionModule {
}