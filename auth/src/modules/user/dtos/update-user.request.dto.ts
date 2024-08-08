import {ApiConsumes, ApiProperty} from '@nestjs/swagger';
import {IsString} from 'class-validator';
import {USER_GENDER} from '../constants/user.constant';

@ApiConsumes('multipart/form-data')
export class UpdateUserRequestDto {
    @ApiProperty({
        description: 'User email',
        example: 'phuckhoa81@gmail.com',
    })
    // @IsEmail()
    readonly email: string;

    @ApiProperty({
        description: 'User fullname',
        example: 'Nguyen Van A',
    })
    @IsString()
    readonly fullName: string;

    @ApiProperty({
        description: 'User shortname',
        example: 'AMan',
    })
    @IsString()
    readonly shortName: string;

    @ApiProperty({
        description: 'User job',
        example: 'Financial specialist',
    })
    @IsString()
    readonly job: string;

    @ApiProperty({
        description: 'User phone number',
        example: '0123456789',
    })
    @IsString()
    readonly phoneNumber: string;

    @ApiProperty({
        description: 'User address ward',
        example: '5 Ward',
    })
    @IsString()
    addressWard: string;

    @ApiProperty({
        description: 'User address district',
        example: '5 District',
    })
    @IsString()
    addressDistrict: string;

    @ApiProperty({
        description: 'User address province',
        example: 'Ho Chi Minh City',
    })
    @IsString()
    addressProvince: string;

    @ApiProperty({
        description: 'User date of birth',
        example: '03/03/2003',
    })
    dateOfBirth: string;

    @ApiProperty({
        description: `User gender 
    male, female, others`,
        example: USER_GENDER.MALE,
    })
    gender: string;

    @ApiProperty({
        description: 'User id card',
        example: '123456789',
    })
    idCard: string;

    @ApiProperty({
        description: 'User Interesting',
        example: ['Real estale'],
    })
    interesting: string[];
}