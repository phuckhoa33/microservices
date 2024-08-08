import {AutoMap} from '@automapper/classes';
import * as Buffer from 'node:buffer';
import {ApiProperty} from "@nestjs/swagger";
import {IResponseMinioFileFormat} from "../../../shared/interfaces/response-minio-file-format.interface";
import {USER_GENDER} from "../constants/user.constant";

export class ViewUserProfileResponseDto {
    @AutoMap()
    @ApiProperty({
        description: 'User id',
        example: '377eaa16-27b0-444f-acb1-171e105572a6',
        required: true,
    })
    _id: string;

    @AutoMap()
    @ApiProperty({
        description: 'User email',
        example: 'phuckhoa81@gmail.com'
    })
    email: string;

    @AutoMap()
    @ApiProperty({
        description: 'User phone number',
        example: '0987654321'
    })
    phoneNumber: string;

    @AutoMap()
    @ApiProperty({
        description: 'User short name',
        example: 'Khoa Pham'
    })
    shortName: string;

    @AutoMap()
    @ApiProperty({
        description: 'Full name',
        example: 'Pham dang khoa'
    })
    fullName: string;

    @AutoMap()
    // image profile
    @ApiProperty({
        description: 'Image profile',
        example: {
            url: 'https://minio.dev.arena.vn/arena-dev/1619721743-IMG_20210429_113943.jpg',
            name: '1619721743-IMG_20210429_113943.jpg',
        }
    })
    imageProfile: IResponseMinioFileFormat;

    @AutoMap()
    @ApiProperty({
        description: 'Address',
        example: 'Phu my ward, district 7, Ho Chi Minh city, Viet Nam'
    })
    address: string;

    @AutoMap()
    @ApiProperty({
        description: 'Date of birth',
        example: '1991-08-01'
    })
    dateOfBirth: Date;

    @AutoMap()
    @ApiProperty({
        description: 'Gender',
        example: USER_GENDER.MALE,
    })
    gender: string;

    @AutoMap()
    @ApiProperty({
        description: 'Id card',
        example: '123456789'
    })
    idCard: string;

    @AutoMap()
    @ApiProperty({
        description: 'Interesting',
        example: ['football', 'music']
    })
    interesting: [];

    @AutoMap()
    @ApiProperty({
        description: 'Job',
        example: 'Developer'
    })
    job: string;

    @AutoMap()
    @ApiProperty({
        description: 'Created at',
        example: '2021-08-01T00:00:00.000Z'
    })
    createdAt: Date;
}
