import {DatabaseBaseEntityAbstract} from './database.base.entity.abstract';
import {
    DATABASE_CREATED_AT_FIELD_NAME,
    DATABASE_CREATED_BY_USER_ID_FIELD_NAME,
    DATABASE_IS_DELETED_FIELD_NAME,
    DATABASE_LAST_MODIFICATION_TIME_FIELD_NAME,
    DATABASE_LAST_MODIFIER_USER_ID_FIELD_NAME,
} from '../../constants/database-fields.constant';

/**
 * Abstract class `DatabaseBaseFullAuditedEntityAbstract` extends {@link DatabaseBaseEntityAbstract} with a generic type parameter.
 * This class is used as a base for entities that require full auditing.
 *
 * @property {Date} DATABASE_CREATED_AT_FIELD_NAME - The date when the entity was created. It is a Date object.
 *
 * @property {string} DATABASE_CREATED_BY_USER_ID_FIELD_NAME - The identifier of the user who created the entity. It is a string.
 *
 * @property {Date} DATABASE_LAST_MODIFICATION_TIME_FIELD_NAME - The date when the entity was last modified. It is a Date object.
 *
 * @property {string} DATABASE_LAST_MODIFIER_USER_ID_FIELD_NAME - The identifier of the user who last modified the entity. It is a string.
 *
 * @property {Date} DATABASE_IS_DELETED_FIELD_NAME - The flag that indicates if the entity is deleted.
 */
export abstract class DatabaseBaseFullAuditedEntityAbstract<T = any> extends DatabaseBaseEntityAbstract<T> {
    abstract [DATABASE_CREATED_AT_FIELD_NAME]: Date;
    abstract [DATABASE_CREATED_BY_USER_ID_FIELD_NAME]?: string;
    abstract [DATABASE_LAST_MODIFICATION_TIME_FIELD_NAME]?: Date;
    abstract [DATABASE_LAST_MODIFIER_USER_ID_FIELD_NAME]?: string;
    abstract [DATABASE_IS_DELETED_FIELD_NAME]: boolean;
}