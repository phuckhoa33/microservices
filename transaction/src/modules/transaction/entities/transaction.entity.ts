import {Prop, SchemaFactory} from "@nestjs/mongoose";
import {AutoMap} from "@automapper/classes";
import {Schema} from "mongoose";
import {DatabaseFullAuditedEntity} from "../../../common/database/decorators/database.decorator";
import {
    DatabaseMongoFullAuditedEntityAbstract
} from "../../../common/database/abstracts/mongo/entities/database.mongo.full-audited-entity.abstract";
import {applySoftDeleteHooks} from "../../../common/database/abstracts/mongo/hooks/database.mongo.soft-delete.hook";
import {CurrencyStatusEnum} from "../../../shared/enum/currency-enum";
export const TransactionDatabaseName = 'transactions';

@DatabaseFullAuditedEntity({
    collection: TransactionDatabaseName,
    toJSON: {
        virtuals: true,
    },
})
export class TransactionEntity extends DatabaseMongoFullAuditedEntityAbstract {
    @AutoMap()
    @Prop({
        required: true,
        type: String,
    })
    userId: string;

    @AutoMap()
    @Prop({
        required: false,
        type: String,
        default: null
    })
    fromSource: string;

    @AutoMap()
    @Prop({
        required: false,
        type: String,
        default: null
    })
    toDestination: string;

    @AutoMap()
    @Prop({
        required: true,
        type: Number,
    })
    amount: string;

    @AutoMap()
    @Prop({
        required: true,
        type: String,
    })
    status: string;

    // Transaction type
    @AutoMap()
    @Prop({
        required: true,
        type: String,
    })
    transactionType: string;

    @AutoMap()
    @Prop({
        required: true,
        type: String,
    })
    transactionDate: string;

    // Transaction description
    @AutoMap()
    @Prop({
        required: true,
        type: Schema.Types.Mixed,
    })
    transactionDescription: string | string[];

    // Transaction method
    @AutoMap()
    @Prop({
        required: true,
        type: String,
    })
    transactionMethod: string;

    // Transaction fee
    @AutoMap()
    @Prop({
        required: true,
        type: Number,
    })
    transactionFee: string;

    // Currency
    @AutoMap()
    @Prop({
        required: true,
        type: String,
        default: CurrencyStatusEnum.TINI
    })
    currency: string;
}

// transaction schema
export const TransactionSchema = SchemaFactory.createForClass(TransactionEntity);
applySoftDeleteHooks(TransactionSchema);
export type TransactionDoc = TransactionEntity & Document;
