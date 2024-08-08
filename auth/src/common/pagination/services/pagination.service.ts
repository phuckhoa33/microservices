import {Injectable} from '@nestjs/common';
import {PageSearchOptionsDto} from '../dtos/page-search-options.dto';
import {DatabaseConnection} from '../../database/decorators/database.decorator';
import {Connection} from 'mongoose';
import {PageMetaDto} from '../dtos/page-meta.dto';
import {PaginationWithSearchResponseDto} from '../dtos/pagination-with-search.response.dto';
import {OrderEnum} from "../constants/order.enum";

@Injectable()
export class PaginationService {
    constructor(
        @DatabaseConnection() private readonly databaseConnection: Connection,
    ) {
    }

    async paginateWithFilterAndSearch(dto: PageSearchOptionsDto, filter: Object, entityName: string, extraCondition?: any[]): Promise<PaginationWithSearchResponseDto> {
        // get page, order, take, skip, search variables in dto
        let {page, order, take, skip, search} = dto;

        if (!page) page = 1;
        if (!order) order = OrderEnum.ASC;
        if (!take) take = 10;
        
        // Get all entities depend on search, filter
        const [entities, total] = await Promise.all([
            this.databaseConnection.model(entityName).aggregate([
                ...extraCondition,
                {
                    $match: filter,
                },
                {
                    $sort: order === 'ASC' ? {createdAt: 1} : {createdAt: -1},
                },
                {
                    $skip: +(page - 1) * take,
                },
                {
                    $limit: +take,
                },
            ]).exec(),
            this.databaseConnection.model(entityName).countDocuments(filter).exec(),
        ]);

        const pageOptionsDto = {
            order: order,
            skip: skip,
            take: take,
            page: page,
        };

        const pageMetaDto = new PageMetaDto({
            pageOptionsDto,
            itemCount: total,
        });

        return {entities, pageMetaDto};
    }
}