import {ApiProperty} from '@nestjs/swagger';
import {IsEmail, IsNotEmpty} from 'class-validator';

export class VerifyOptRequestDto {
    @ApiProperty({
        required: true,
        example: '0123456789',
    })
    @IsEmail()
    @IsNotEmpty()
    phoneNumber: string;

    @ApiProperty({
        required: true,
        example: '123456',
    })
    @IsNotEmpty()
    otp: string;
}
