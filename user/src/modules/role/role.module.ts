import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {RoleEntity, RoleSchema} from './entities/role.entity';
import {PRIMARY_DATABASE_CONNECTION_NAME} from '../../common/database/constants/database-name.constant';
import {RoleService} from './services/role.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: RoleEntity.name,
                schema: RoleSchema,
            },
        ], PRIMARY_DATABASE_CONNECTION_NAME),
    ],
    providers: [RoleService],
    exports: [RoleService],
})

export class RoleModule {
}