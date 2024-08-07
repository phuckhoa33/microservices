import {ApiPropertyOptional} from '@nestjs/swagger';
import {IsEnum, IsInt, IsOptional, Max, Min} from 'class-validator';
import {Type} from 'class-transformer';
import {OrderEnum} from '../constants/order.enum';

export class PageOptionsDto {
    @ApiPropertyOptional({
        enum: OrderEnum,
        default: OrderEnum.ASC,
        description: 'ASC or DESC',
    })
    @IsEnum(OrderEnum)
    @IsOptional()
    readonly order?: OrderEnum = OrderEnum.ASC;

    @ApiPropertyOptional({
        minimum: 1,
        default: 1,
        description: 'The page number',
    })
    @Type(() => Number)
    @IsInt()
    @Min(1, {message: 'Minimal page is 1'})
    @IsOptional()
    readonly page?: number = 1;

    @ApiPropertyOptional({
        minimum: 1,
        maximum: 200,
        default: 10,
        description: 'The number of items per page',
    })
    @Type(() => Number)
    @IsInt()
    @Min(1, {message: 'Minimal take is 1'})
    @Max(200, {message: 'Maximal take is 200'})
    @IsOptional()
    readonly take?: number = 10;

    get skip(): number {
        return (this.page - 1) * this.take;
    }
}
