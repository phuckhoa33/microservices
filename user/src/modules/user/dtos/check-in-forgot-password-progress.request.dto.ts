import {ApiProperty} from '@nestjs/swagger';

export class CheckInForgottenPasswordProgressRequestDto {
    @ApiProperty({
        description: 'User phone number',
        example: '0123456789',
        required: true,
        nullable: false,
    })
    readonly phoneNumber: string;
}