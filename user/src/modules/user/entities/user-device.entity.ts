import {DatabaseFullAuditedEntity} from '../../../common/database/decorators/database.decorator';
import {
    DatabaseMongoEntityAbstract,
} from '../../../common/database/abstracts/mongo/entities/database.mongo.entity.abstract';
import {Prop, SchemaFactory} from '@nestjs/mongoose';
import {DeviceStatusEnum, DeviceTypeEnum} from '../constants/device.enum';
import {applySoftDeleteHooks} from '../../../common/database/abstracts/mongo/hooks/database.mongo.soft-delete.hook';

const userDeviceCollectionName: string = 'user_devices';

export interface IUSerDeviceEntity {
    userId?: string;
    deviceType: DeviceTypeEnum;
    deviceId: string;
    deviceStatus?: DeviceStatusEnum;
    deviceInfo?: string;
    refreshToken?: string;
    loginCode?: string;
    socketId?: string;
    browserName?: string;
    osName?: string;
}

@DatabaseFullAuditedEntity({
    collection: userDeviceCollectionName,
})
export class UserDeviceEntity extends DatabaseMongoEntityAbstract implements IUSerDeviceEntity {
    @Prop({
        type: String,
        required: false,
    })
    userId?: string;

    @Prop({
        type: String,
        required: true,
    })
    deviceId: string;

    @Prop({
        type: String,
        required: true,
    })
    deviceType: DeviceTypeEnum;

    @Prop({
        type: String,
        default: DeviceStatusEnum.WAITING_FOR_APPROVAL,
    })
    deviceStatus: DeviceStatusEnum;

    @Prop({
        type: String,
        default: null,
    })
    deviceInfo: string;

    @Prop({
        type: String,
        default: null,
    })
    refreshToken: string;

    @Prop({
        type: String,
        default: null,
    })
    loginCode: string;

    @Prop({
        type: String,
        default: null,
    })
    socketId?: string;

    @Prop({
        type: String,
        default: null,
    })
    browserName?: string;

    @Prop({
        type: String,
        default: null,
    })
    osName?: string;
}

export const UserDeviceSchema = SchemaFactory.createForClass(UserDeviceEntity);
applySoftDeleteHooks(UserDeviceSchema);