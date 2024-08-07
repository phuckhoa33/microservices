import {ApiProperty} from '@nestjs/swagger';

export class CheckUserExistRequestDto {
    @ApiProperty({
        description: 'User phone number',
        example: '0123456789',
        required: true,
        nullable: false,
    })
    readonly phoneNumber: string;
}