import {ApiProperty} from '@nestjs/swagger';
import {IsNotEmpty} from 'class-validator';

export class GetShortenTokenRequestDto {
    @ApiProperty({
        description: 'Your token',
        example: 'c_fc_EiYGSrsmRmfdMoZQN:APA91bH0rE-Arc-3VXf-tzUH57axwUkegsDjzTaNRzZ8hnibPNNeUOrs0u-5NDIlPXRuAPP71Q7tFJrnYr3MhiSjSjPv8Z5AfGJWluRrEYKM0LUsifLOXjpHhrcFFLO_C2w96qNxN1VM',
        required: true,
        nullable: false,
    })
    @IsNotEmpty()
    token: string;
}