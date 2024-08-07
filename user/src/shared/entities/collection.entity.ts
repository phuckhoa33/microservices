import {DatabaseFullAuditedEntity} from '../../common/database/decorators/database.decorator';
import {
    DatabaseMongoFullAuditedEntityAbstract,
} from '../../common/database/abstracts/mongo/entities/database.mongo.full-audited-entity.abstract';
import {AutoMap} from '@automapper/classes';
import {Prop, SchemaFactory} from '@nestjs/mongoose';
import {applySoftDeleteHooks} from '../../common/database/abstracts/mongo/hooks/database.mongo.soft-delete.hook';
import {EntityStatusEnum} from '../enum/entity-status-enum';

export const CollectionDatabaseName = 'collections';

@DatabaseFullAuditedEntity({
    collection: CollectionDatabaseName,
    toJSON: {
        virtuals: true,
    },
})
export class CollectionEntity extends DatabaseMongoFullAuditedEntityAbstract {
    @AutoMap()
    @Prop({
        required: true,
        type: String,
    })
    collectionName: string;

    @AutoMap()
    @Prop({
        required: true,
        type: String,
    })
    collectionImage: string;

    @AutoMap()
    @Prop({
        required: true,
        type: String,
    })
    collectionCoverImage: string;

    @AutoMap()
    @Prop({
        required: true,
        type: String,
    })
    collectionDescription: string;

    @AutoMap()
    @Prop({
        required: true,
        type: String,
        default: EntityStatusEnum.INACTIVE,
    })
    collectionStatus: string;

    @Prop({
        required: false,
        type: Number,
        default: 0,
    })
    publicDate: string;

    @AutoMap()
    @Prop({
        required: true,
        type: Number,
    })
    quantityOfNFTs: number;

    @AutoMap()
    @Prop({
        required: true,
        type: String,
    })
    projectId: string;
}


export const CollectionSchema = SchemaFactory.createForClass(CollectionEntity);
applySoftDeleteHooks(CollectionSchema);

export type CollectionDoc = CollectionEntity & Document;