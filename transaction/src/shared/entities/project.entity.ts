import {DatabaseFullAuditedEntity} from '../../common/database/decorators/database.decorator';
import {
    DatabaseMongoFullAuditedEntityAbstract,
} from '../../common/database/abstracts/mongo/entities/database.mongo.full-audited-entity.abstract';
import {Prop, SchemaFactory} from '@nestjs/mongoose';
import {AutoMap} from '@automapper/classes';
import {applySoftDeleteHooks} from '../../common/database/abstracts/mongo/hooks/database.mongo.soft-delete.hook';
import {EntityStatusEnum} from '../enum/entity-status-enum';

export const ProjectDatabaseName = 'projects';

@DatabaseFullAuditedEntity({
    collection: ProjectDatabaseName,
    toJSON: {
        virtuals: true,
    },
})
export class ProjectEntity extends DatabaseMongoFullAuditedEntityAbstract {

    @AutoMap()
    @Prop({
        required: true,
        type: String,
    })
    projectName: string;

    @AutoMap()
    @Prop({
        required: true,
        type: String,
    })
    projectImage: string;

    @AutoMap()
    @Prop({
        required: true,
        type: String,
    })
    projectDescription: string;

    @AutoMap()
    @Prop({
        required: true,
        type: [String],
    })
    projectCategories: string[];

    @AutoMap()
    @Prop({
        required: false,
        type: String,
        default: null,
    })
    projectAddress: string;

    @AutoMap()
    @Prop({
        required: false,
        type: [String],
        default: null,
    })
    projectDocument: string[];

    @AutoMap()
    @Prop({
        required: false,
        type: Number,
        default: null,
    })
    quantityOfFloor: number;

    @AutoMap()
    @Prop({
        required: false,
        type: Number,
        default: null,
    })
    quantityOfUnit: number;

    @AutoMap()
    @Prop({
        required: false,
        type: String,
        default: null,
    })
    projectWebsite: string;

    @AutoMap()
    @Prop({
        required: false,
        type: [String],
        default: null,
    })
    convenientServices: string[];

    @AutoMap()
    @Prop({
        required: true,
        type: String,
        default: EntityStatusEnum.INACTIVE,
    })
    projectStatus: string;

    @AutoMap()
    @Prop({
        required: true,
        type: String,
    })
    merchantId: string;
}

export const ProjectSchema = SchemaFactory.createForClass(ProjectEntity);
applySoftDeleteHooks(ProjectSchema);

export type ProjectDoc = ProjectEntity & Document;