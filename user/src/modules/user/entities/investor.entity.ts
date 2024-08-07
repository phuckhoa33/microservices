import {Prop, SchemaFactory} from '@nestjs/mongoose';
import {AutoMap} from '@automapper/classes';
import {RoleEntity} from '../../role/entities/role.entity';
import {Types} from 'mongoose';
import {
    DatabaseMongoFullAuditedEntityAbstract,
} from '../../../common/database/abstracts/mongo/entities/database.mongo.full-audited-entity.abstract';
import {applySoftDeleteHooks} from '../../../common/database/abstracts/mongo/hooks/database.mongo.soft-delete.hook';
import {DatabaseFullAuditedEntity} from '../../../common/database/decorators/database.decorator';

export const InvestorDatabaseName = 'investors';

@DatabaseFullAuditedEntity({
    collection: InvestorDatabaseName,
    toJSON: {
        virtuals: true,
    },
})
export class InvestorEntity extends DatabaseMongoFullAuditedEntityAbstract {
    @AutoMap()
    @Prop({
        sparse: true,
        trim: true,
        type: String,
        lowercase: true,
    })
    email: string;

    @AutoMap()
    @Prop({
        index: true,
        trim: true,
        lowercase: true,
        type: String,
        required: true,
    })
    phoneNumber: string;

    @AutoMap()
    @Prop({
        index: true,
        trim: true,
        lowercase: true,
        type: String,
        required: true,
    })
    shortName: string;

    @AutoMap()
    @Prop({
        type: String,
        maxlength: 50,
        default: null,
    })
    fullName: string;

    @AutoMap()
    @Prop({
        type: Types.Buffer,
        default: null,
    })
    image: any;

    @AutoMap()
    @Prop({
        type: String,
        default: null,
    })
    address: string;

    @AutoMap()
    @Prop({
        type: String,
        required: false,
    })
    walletId: string;

    @AutoMap()
    @Prop({
        type: String,
        default: null,
    })
    dateOfBirth: string;

    @AutoMap()
    @Prop({
        type: String,
        default: null,
    })
    gender: string;

    @AutoMap()
    @Prop({
        type: String,
        maxlength: 50,
        default: null,
    })
    idCard: string;

    @AutoMap()
    @Prop({
        type: String,
        maxlength: 50,
        default: null,
    })
    job: string;

    @AutoMap()
    @Prop({
        type: Array,
        default: [],
    })
    interesting: string[];

    @Prop({
        required: true,
        type: String,
    })
    password: string;

    @AutoMap()
    @Prop({
        required: true,
        type: Boolean,
        default: false,
    })
    verifiedAccount: boolean;

    @AutoMap()
    @Prop({
        required: false,
        type: String,
        default: null,
    })
    verifyAccountOtp: string;

    // Role references to role collection
    @AutoMap()
    @Prop({
        type: [{ref: RoleEntity.name, type: String, default: null}],
    })
    roles: RoleEntity[];

    @AutoMap()
    @Prop({
        type: Boolean,
        default: false,
    })
    disabledAccount: boolean;

    // Image profile
    @AutoMap()
    @Prop({
        type: String,
        default: null,
    })
    imageProfile: string;
}

export const InvestorSchema = SchemaFactory.createForClass(InvestorEntity);
applySoftDeleteHooks(InvestorSchema);

export type UserDoc = InvestorEntity & Document;
