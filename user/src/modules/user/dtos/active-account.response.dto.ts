import {ActiveAccountRequestDto} from './active-account.request.dto';
import {ApiProperty} from '@nestjs/swagger';
import {IsBoolean} from 'class-validator';

export class ActiveAccountResponseDto extends ActiveAccountRequestDto {
    @ApiProperty({
        example: true,
    })
    @IsBoolean()
    checkActiveUser: boolean;
}