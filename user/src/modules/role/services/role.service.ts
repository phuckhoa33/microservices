import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {RoleEntity} from '../entities/role.entity';
import {PRIMARY_DATABASE_CONNECTION_NAME} from '../../../common/database/constants/database-name.constant';
import {Model} from 'mongoose';

@Injectable()
export class RoleService {
    constructor(
        @InjectModel(RoleEntity.name, PRIMARY_DATABASE_CONNECTION_NAME)
        private readonly roleModel: Model<RoleEntity>,
    ) {
    }

    async getRoleByName(name: string): Promise<RoleEntity> {
        return await this.roleModel.findOne({name}).exec();
    }

    async getRoleById(roleId: string): Promise<RoleEntity> {
        return (await this.roleModel.findOne({_id: roleId}).exec());
    }
}