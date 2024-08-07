import {ApiProperty} from '@nestjs/swagger';

export class RegisterDeviceRequestDto {
    @ApiProperty({
        description: 'Firebase token',
        example: 'c_fc_EiYGSrsmRmfdMoZQN:APA91bH0rE-Arc-3VXf-tzUH57axwUkegsDjzTaNRzZ8hnibPNNeUOrs0u-5NDIlPXRuAPP71Q7tFJrnYr3MhiSjSjPv8Z5AfGJWluRrEYKM0LUsifLOXjpHhrcFFLO_C2w96qNxN1VM',
    })
    readonly firebaseToken: string;
}