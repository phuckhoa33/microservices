import {PageOptionsDto} from './page-options.dto';
import {ApiPropertyOptional} from '@nestjs/swagger';

export class PageSearchOptionsDto extends PageOptionsDto {
    @ApiPropertyOptional({
        required: false,
        description: 'Search query',
    })
    readonly search?: string;
}