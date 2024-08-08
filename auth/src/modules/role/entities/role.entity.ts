import {Prop, SchemaFactory} from '@nestjs/mongoose';
import {AutoMap} from '@automapper/classes';
import {DatabaseAuditedEntity} from '../../../common/database/decorators/database.decorator';
import {
    DatabaseMongoAuditedEntityAbstract,
} from '../../../common/database/abstracts/mongo/entities/database.mongo.audited-entity.abstract';

export const RoleDatabaseName = 'roles';

@DatabaseAuditedEntity({
    collection: RoleDatabaseName,
})
export class RoleEntity extends DatabaseMongoAuditedEntityAbstract {
    @AutoMap()
    @Prop({
        required: true,
        index: true,
        unique: true,
        type: String,
        maxlength: 50,
    })
    name: string;

    @AutoMap()
    @Prop({
        required: false,
        type: [String],
    })
    permissions: string[];
}

export const RoleSchema = SchemaFactory.createForClass(RoleEntity);

export type RoleDocument = RoleEntity & Document;
