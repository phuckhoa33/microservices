import {ApiProperty} from '@nestjs/swagger';
import {IsNotEmpty} from 'class-validator';

export class GetDeviceInfoRequestDto {
    @ApiProperty({
        description: 'Device id of user',
        example: '$Pafsfaf333',
        required: true,
        nullable: false,
    })
    @IsNotEmpty()
    deviceId: string;
}