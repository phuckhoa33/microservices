import {ApiProperty} from '@nestjs/swagger';
import {PageOptionsDto} from '../../../common/pagination/dtos/page-options.dto';

export class GetAllUsersRequestDto extends PageOptionsDto {
    @ApiProperty({
        required: false,
        description: 'User name to search',
        example: 'Nguyen Van A',
    })
    readonly search?: string;
}
