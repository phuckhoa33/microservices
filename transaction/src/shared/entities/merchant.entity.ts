import {Prop, SchemaFactory} from '@nestjs/mongoose';
import {AutoMap} from '@automapper/classes';
import {MerchantStatus} from '../enum/merchant-status.enum';
import {applySoftDeleteHooks} from '../../common/database/abstracts/mongo/hooks/database.mongo.soft-delete.hook';
import {DatabaseFullAuditedEntity} from '../../common/database/decorators/database.decorator';
import {
    DatabaseMongoFullAuditedEntityAbstract,
} from '../../common/database/abstracts/mongo/entities/database.mongo.full-audited-entity.abstract';

export const MerchantDatabaseName = 'merchants';

@DatabaseFullAuditedEntity({
    collection: MerchantDatabaseName,
    toJSON: {
        virtuals: true,
    },
})
export class MerchantEntity extends DatabaseMongoFullAuditedEntityAbstract {
    @Prop({
        required: true,
        type: String,
    })
    password: string;

    @AutoMap()
    @Prop({
        required: true,
        type: String,
    })
    companyName: string;

    @AutoMap()
    @Prop({
        required: true,
        type: String,
        default: MerchantStatus.PENDING,
    })
    status: string;

    @AutoMap()
    @Prop({
        type: Number,
        default: 0,
    })
    walletBalance: number;

    @AutoMap()
    @Prop({
        index: true,
        trim: true,
        lowercase: true,
        type: String,
        required: true,
    })
    officialName: string;

    @AutoMap()
    @Prop({
        index: true,
        trim: true,
        lowercase: true,
        type: String,
        required: true,
    })
    taxCode: string;

    @AutoMap()
    @Prop({
        type: String,
        maxlength: 50,
        default: null,
    })
    address: string;

    @AutoMap()
    @Prop({
        type: String,
        default: null,
    })
    phoneNumber: string;

    @AutoMap()
    @Prop({
        type: String,
        default: null,
    })
    email: string;

    @AutoMap()
    @Prop({
        required: true,
    })
    businessSector: string;

    @AutoMap()
    @Prop({
        default: null,
        type: String,
    })
    document: string;


    @AutoMap()
    @Prop({
        default: null,
        type: String,
    })
    logo: string;

    @AutoMap()
    @Prop({
        type: Boolean,
        default: false,
    })
    disabledAccount: boolean;

    @AutoMap()
    @Prop({
        required: false,
        type: String,
        default: null,
    })
    refreshTokens: string;

    @AutoMap()
    @Prop({
        required: false,
        type: String,
        default: null,
    })
    verifyAccountOtp: string;
}

export const MerchantSchema = SchemaFactory.createForClass(MerchantEntity);
applySoftDeleteHooks(MerchantSchema);

export type MerchantDoc = MerchantEntity & Document;
