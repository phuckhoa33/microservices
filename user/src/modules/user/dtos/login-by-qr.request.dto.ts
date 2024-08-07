import {ApiProperty} from '@nestjs/swagger';
import {DeviceTypeEnum} from '../constants/device.enum';
import {IsEnum} from 'class-validator';

export class LoginByQrRequestDto {
    @ApiProperty({
        description: 'Device Type',
        required: true,
        enum: Object.values(DeviceTypeEnum),
    })
    @IsEnum(DeviceTypeEnum)
    deviceType: DeviceTypeEnum;
}