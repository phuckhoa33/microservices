import {ApiProperty} from '@nestjs/swagger';
import {IsString, Matches, MaxLength, MinLength} from 'class-validator';
import {Match} from '../decorators/match.decorator';

export class ResetPasswordRequestDto {
    @ApiProperty({
        description: 'The otp is sent through sms or email',
        example: '12345',
        required: true,
        nullable: false,
    })
    @IsString()
    @MinLength(5)
    @MaxLength(6)
    verifyAccountOtp: string;

    @ApiProperty({
        description: 'User phone number',
        example: '+84123456789',
        required: true,
        nullable: false,
    })
    @Matches(/^84\d{9,10}$/, {message: 'Invalid phone number, it should be +84xxxxxxxxx'})
    readonly phoneNumber: string;

    @ApiProperty({
        description: 'Password of user',
        example: '123456@Abc',
        required: true,
        nullable: false,
    })
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'Password should contain at least one number, one uppercase, one lowercase letter, one special character and at least 8 characters long'})
    newPassword: string;

    @ApiProperty({
        description: 'Confirm password of user',
        example: '123456@Abc',
        required: true,
        nullable: false,
    })
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    @Match('newPassword')
    confirmPassword: string;
}