import {ApiProperty} from '@nestjs/swagger';

export class ForgotPasswordRequestDto {
    @ApiProperty({
        description: 'user phone number, will be use as username',
        example: '0123456789',
        required: true,
        nullable: false,
    })
    readonly phoneNumber: string;
}