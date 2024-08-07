import {ApiProperty} from '@nestjs/swagger';
import {IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength} from 'class-validator';

export class ActiveAccountRequestDto {
    @ApiProperty({
        required: true,
        example: 'email@example.com',
    })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({
        required: true,
        example: '123456',
    })
    @IsNotEmpty()
    otp: string;

    @ApiProperty({
        required: true,
        example: '$Pafsfaf333',
    })
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'password too weak'})
    password: string;
}
