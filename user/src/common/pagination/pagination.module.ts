import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {PRIMARY_DATABASE_CONNECTION_NAME} from '../database/constants/database-name.constant';
import {PaginationService} from './services/pagination.service';

@Module({
    imports: [
        MongooseModule.forFeature([], PRIMARY_DATABASE_CONNECTION_NAME),
    ],
    providers: [PaginationService],
    exports: [PaginationService],
})
export class PaginationModule {
}