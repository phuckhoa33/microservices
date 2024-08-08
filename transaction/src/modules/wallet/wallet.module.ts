import {Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import {WalletEntity, WalletSchema} from "./entities/wallet.entity";
import {PRIMARY_DATABASE_CONNECTION_NAME} from "../../common/database/constants/database-name.constant";
import {InvestorWalletService} from "./services/investor-wallet.service";
import {WalletProfile} from "./profile/wallet.profile";
import { InvestorEntity, InvestorSchema } from "src/shared/entities/investor.entity";

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: WalletEntity.name,
                schema: WalletSchema
            },
            {
                name: InvestorEntity.name,
                schema: InvestorSchema
            }
        ], PRIMARY_DATABASE_CONNECTION_NAME)
    ],
    providers: [InvestorWalletService, WalletProfile],
    exports: [InvestorWalletService]
})
export class WalletModule {
}