import {ApiProperty} from '@nestjs/swagger';
import {IsNotEmpty} from 'class-validator';

export class AcceptAccessPermissionRequestDto {
    @ApiProperty({
        description: 'Client request token',
        example: '111111',
        required: true,
        nullable: false,
    })
    @IsNotEmpty()
    readonly token: boolean;
}