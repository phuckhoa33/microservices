import {ApiProperty} from '@nestjs/swagger';

export class UpdateDeviceIdRequestDto {
    @ApiProperty({
        description: 'Old device id',
        example: '1634025600000333333333',
        required: true,
        nullable: false,
    })
    oldDeviceId: string;


    @ApiProperty({
        description: 'Old device id',
        example: '1634025600000333333333',
        required: true,
        nullable: false,
    })
    newDeviceId: string;
}