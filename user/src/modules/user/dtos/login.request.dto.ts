import {ApiProperty} from '@nestjs/swagger';
import {IsNotEmpty, Matches} from 'class-validator';

export class LoginRequestDto {
    @ApiProperty({
        description: 'User phone number, will be use as username',
        example: '84123456789',
        required: true,
        nullable: false,
    })
    // Ensure the phone number has form: +84xxxxxxxxx
    @Matches(/^84\d{9,10}$/, {message: 'Invalid phone number, it should be 84xxxxxxxxx'})
    readonly phoneNumber: string;

    @ApiProperty({
        description: 'Password of user',
        example: '123456@Abc',
        required: true,
        nullable: false,
    })
    @IsNotEmpty()
    password: string;
}
