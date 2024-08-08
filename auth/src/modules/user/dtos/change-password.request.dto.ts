import {ApiProperty} from '@nestjs/swagger';

export class ChangePasswordRequestDto {
    @ApiProperty({
        description: 'Old password of user',
        example: '123456@Abc',
        required: true,
        nullable: false,
    })
    oldPassword: string;

    @ApiProperty({
        description: 'New password of user',
        example: '123456@Abc',
        required: true,
        nullable: false,
    })
    newPassword: string;
}
