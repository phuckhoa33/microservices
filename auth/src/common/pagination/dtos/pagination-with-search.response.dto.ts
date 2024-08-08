import {DatabaseMongoEntityAbstract} from '../../database/abstracts/mongo/entities/database.mongo.entity.abstract';
import {PageMetaDto} from './page-meta.dto';

export class PaginationWithSearchResponseDto {
    entities: DatabaseMongoEntityAbstract[];
    pageMetaDto: PageMetaDto;
}