﻿import {DatabaseBaseFullAuditedEntityAbstract} from '../../base/database.base.full-audited-entity.abstract';
import {Prop} from '@nestjs/mongoose';
import {DatabaseDefaultUUID} from '../../../constants/database.function.constant';
import {
    DATABASE_CREATED_AT_FIELD_NAME,
    DATABASE_CREATED_BY_USER_ID_FIELD_NAME,
    DATABASE_IS_DELETED_FIELD_NAME,
    DATABASE_LAST_MODIFICATION_TIME_FIELD_NAME,
    DATABASE_LAST_MODIFIER_USER_ID_FIELD_NAME,
} from '../../../constants/database-fields.constant';
import {AutoMap} from '@automapper/classes';

/**
 * Abstract class `DatabaseMongoFullAuditedEntityAbstract` extends {@link DatabaseBaseFullAuditedEntityAbstract} with a string type parameter.
 * This class is used as a base for entities that require full auditing in a MongoDB database.
 *
 * @property {string} _id - The unique identifier for the entity. It is a string and its default value is generated by `DatabaseDefaultUUID`.
 *
 * @property {Date} DATABASE_CREATED_AT_FIELD_NAME - The date when the entity was created. It is a Date object and its default value is the current date and time.
 *
 * @property {string} DATABASE_CREATED_BY_USER_ID_FIELD_NAME - The identifier of the user who created the entity. It is a string and its default value is null.
 *
 * @property {Date} DATABASE_LAST_MODIFICATION_TIME_FIELD_NAME - The date when the entity was last modified. It is a Date object and its default value is null.
 *
 * @property {string} DATABASE_LAST_MODIFIER_USER_ID_FIELD_NAME - The identifier of the user who last modified the entity. It is a string and its default value is null.
 *
 * @property {Date} DATABASE_IS_DELETED_FIELD_NAME - The flag that indicates if the entity is deleted.
 */
export abstract class DatabaseMongoFullAuditedEntityAbstract extends DatabaseBaseFullAuditedEntityAbstract<string> {
    @AutoMap()
    @Prop({
        type: String,
        default: DatabaseDefaultUUID,
    })
    _id: string;

    @AutoMap()
    @Prop({type: Date, default: Date.now})
    [DATABASE_CREATED_AT_FIELD_NAME]: Date;

    @AutoMap()
    @Prop({type: String, default: null})
    [DATABASE_CREATED_BY_USER_ID_FIELD_NAME]: string;

    @AutoMap()
    @Prop({type: Date, default: null})
    [DATABASE_LAST_MODIFICATION_TIME_FIELD_NAME]?: Date;

    @AutoMap()
    @Prop({type: String, default: null})
    [DATABASE_LAST_MODIFIER_USER_ID_FIELD_NAME]: string;

    @AutoMap()
    @Prop({type: Boolean, default: false})
    [DATABASE_IS_DELETED_FIELD_NAME] = false;

    /**
     * @function softDelete - A method that sets the `isDeleted` flag to `true` and saves the entity.
     * @returns {Promise<void>} - A promise that resolves when the entity is saved.
     */
    softDelete: Function;
}