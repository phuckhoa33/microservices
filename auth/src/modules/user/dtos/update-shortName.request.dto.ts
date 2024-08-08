import {ApiProperty} from '@nestjs/swagger';
import {IsString} from 'class-validator';

export class UpdateShortNameRequestDto {
    @ApiProperty({
        description: 'User shortname',
        example: 'AMan',
    })
    @IsString()
    readonly shortName: string;
}