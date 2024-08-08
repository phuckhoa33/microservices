import {ApiProperty} from '@nestjs/swagger';
import {IsEnum, IsNotEmpty, Matches} from 'class-validator';
import {DeviceTypeEnum} from '../constants/device.enum';

export class LoginV2RequestDto {
    @ApiProperty({
        description: 'User phone number, will be use as username',
        required: true,
        nullable: false,
    })
    // Ensure the phone number has form: +84xxxxxxxxx
    @Matches(/^84\d{9,10}$/, {message: 'Invalid phone number, it should be 84xxxxxxxxx'})
    readonly phoneNumber: string;

    @ApiProperty({
        description: 'Password of user',
        required: true,
        nullable: false,
    })
    @IsNotEmpty()
    password: string;

    // Device type
    @ApiProperty({
        description: 'Device type',
        required: true,
        nullable: false,
        enum: Object.values(DeviceTypeEnum),
    })
    @IsNotEmpty()
    @IsEnum(DeviceTypeEnum)
    deviceType: DeviceTypeEnum;
}