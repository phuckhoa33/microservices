import {IsString} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';

export class ImageProfileResponseDto {
    @ApiProperty({
        description: 'User image',
        example: 'https://www.google.com.vn/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png',
    })
    @IsString()
    readonly imageUrl: string;

    @ApiProperty({
        description: 'User primitive image',
        example: 'googlelogo_color_272x92dp.png',
    })
    readonly primitiveImage: string;
}