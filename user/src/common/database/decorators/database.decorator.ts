import {InjectConnection, InjectModel, Schema, SchemaOptions} from '@nestjs/mongoose';
import {PRIMARY_DATABASE_CONNECTION_NAME} from '../constants/database-name.constant';
import {
    DATABASE_CREATED_AT_FIELD_NAME,
    DATABASE_LAST_MODIFICATION_TIME_FIELD_NAME,
} from '../constants/database-fields.constant';

export function DatabaseConnection(
    connectionName?: string,
): ParameterDecorator {
    return InjectConnection(connectionName ?? PRIMARY_DATABASE_CONNECTION_NAME);
}

export function DatabaseModel(
    entity: any,
    connectionName?: string,
): ParameterDecorator {
    return InjectModel(entity, connectionName ?? PRIMARY_DATABASE_CONNECTION_NAME);
}

export function DatabaseEntity(options?: SchemaOptions): ClassDecorator {
    return Schema({
        ...options,
        versionKey: false,
    });
}

export function DatabaseAuditedEntity(options?: SchemaOptions): ClassDecorator {
    return Schema({
        ...options,
        versionKey: false,
        timestamps: {
            createdAt: DATABASE_CREATED_AT_FIELD_NAME,
            updatedAt: DATABASE_LAST_MODIFICATION_TIME_FIELD_NAME,
        },
    });
}

export function DatabaseFullAuditedEntity(options?: SchemaOptions): ClassDecorator {
    return Schema({
        ...options,
        versionKey: false,
        timestamps: {
            createdAt: DATABASE_CREATED_AT_FIELD_NAME,
            updatedAt: DATABASE_LAST_MODIFICATION_TIME_FIELD_NAME,
        },
        methods: {
            async softDelete(this: any): Promise<void> {
                this.isDeleted = true;
                await this.save();
            },
        },
    });
}