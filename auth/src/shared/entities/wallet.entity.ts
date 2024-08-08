// Create wallet entity
import {AutoMap} from "@automapper/classes";
import {Prop, SchemaFactory} from "@nestjs/mongoose";
import { DatabaseMongoFullAuditedEntityAbstract } from "src/common/database/abstracts/mongo/entities/database.mongo.full-audited-entity.abstract";
import { DatabaseFullAuditedEntity } from "src/common/database/decorators/database.decorator";
import { CurrencyStatusEnum } from "../enum/currency-enum";
import { WalletStatusEnumConstant } from "../enum/wallet-status.enum.constant";
import { WalletTypeEnumConstant } from "../enum/wallet-type.enum.constant";
import { applySoftDeleteHooks } from "src/common/database/abstracts/mongo/hooks/database.mongo.soft-delete.hook";

export const WalletDatabaseName = 'wallets';

@DatabaseFullAuditedEntity({
    collection: WalletDatabaseName,
    toJSON: {
        virtuals: true,
    },
})
export class WalletEntity extends DatabaseMongoFullAuditedEntityAbstract {
    // Wallet balance 
    @AutoMap()
    @Prop({
        required: false,
        type: Number,
        default: 0
    })
    balance: number;

    // Wallet currency
    @AutoMap()
    @Prop({
        required: false,
        type: String,
        default: CurrencyStatusEnum.VND
    })
    currency: string;

    // Wallet status
    @AutoMap()
    @Prop({
        required: false,
        type: String,
        default: WalletStatusEnumConstant.ACTIVE
    })
    status: string;

    // Wallet type
    @AutoMap()
    @Prop({
        required: true,
        type: String,
        default: WalletTypeEnumConstant.INVESTOR
    })
    type: string;
}

// Schema
export const WalletSchema = SchemaFactory.createForClass(WalletEntity);
applySoftDeleteHooks(WalletSchema);
// Doc
export type WalletDoc = WalletEntity & Document;