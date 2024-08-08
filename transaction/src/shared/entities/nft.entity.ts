import {DatabaseFullAuditedEntity} from '../../common/database/decorators/database.decorator';
import {
    DatabaseMongoFullAuditedEntityAbstract,
} from '../../common/database/abstracts/mongo/entities/database.mongo.full-audited-entity.abstract';
import {AutoMap} from '@automapper/classes';
import {Prop, SchemaFactory} from '@nestjs/mongoose';
import {applySoftDeleteHooks} from '../../common/database/abstracts/mongo/hooks/database.mongo.soft-delete.hook';
import {EntityStatusEnum} from '../enum/entity-status-enum';

export const NftDatabaseName = 'nfts';

@DatabaseFullAuditedEntity({
    collection: NftDatabaseName,
    toJSON: {
        virtuals: true,
    },
})
export class NftEntity extends DatabaseMongoFullAuditedEntityAbstract {
    @AutoMap()
    @Prop({
        required: true,
        type: String,
    })
    nftName: string;

    @AutoMap()
    @Prop({
        required: false,
        type: String,
        default: null,
    })
    nftPrice: string;

    @AutoMap()
    @Prop({
        required: false,
        type: String,
        default: null,
    })
    publicDate: string;

    @AutoMap()
    @Prop({
        required: true,
        type: String,
    })
    nftImage: string;

    @AutoMap()
    @Prop({
        required: true,
        type: String,
    })
    nftDescription: string;

    @AutoMap()
    @Prop({
        required: false,
        type: String,
        default: null,
    })
    nftOwner: string;

    @AutoMap()
    @Prop({
        required: true,
        type: String,
        default: EntityStatusEnum.INACTIVE,
    })
    nftStatus: string;

    @AutoMap()
    @Prop({
        required: true,
        type: String,
    })
    collectionId: string;
}

export const NftSchema = SchemaFactory.createForClass(NftEntity);
applySoftDeleteHooks(NftSchema);

export type NftDoc = NftEntity & Document;