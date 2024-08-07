import {DatabaseFullAuditedEntity} from '../../../common/database/decorators/database.decorator';
import {
    DatabaseMongoEntityAbstract,
} from '../../../common/database/abstracts/mongo/entities/database.mongo.entity.abstract';
import {AutoMap} from '@automapper/classes';
import {Prop, SchemaFactory} from '@nestjs/mongoose';

const UserFavoriteDatabaseName = 'favorites';

@DatabaseFullAuditedEntity({
    collection: UserFavoriteDatabaseName,
})
export class FavoriteEntity extends DatabaseMongoEntityAbstract {
    @AutoMap()
    @Prop({
        required: true,
        type: String,
    })
    favoriteEntity: string;

    @AutoMap()
    @Prop({
        required: true,
        type: String,
    })
    entityId: string;

    @AutoMap()
    @Prop({
        required: true,
        type: String,
    })
    userId: string;
}

export const FavoriteSchema = SchemaFactory.createForClass(FavoriteEntity);
// applySoftDeleteHooks(FavoriteSchema);

export type FavoriteDoc = FavoriteEntity & Document;