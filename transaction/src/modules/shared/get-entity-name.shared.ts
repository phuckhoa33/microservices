import {ProjectEntity} from '../../shared/entities/project.entity';
import {CollectionEntity} from '../../shared/entities/collection.entity';
import {NotFoundException} from '@nestjs/common';
import { EntityConstantEnum } from 'src/shared/enum/entity.constant.enum';

export const getEntityNameShared = (entity: string) => {
    let entityName: string;
    switch (entity) {
        case EntityConstantEnum.PROJECT:
            entityName = ProjectEntity.name;
            break;
        case EntityConstantEnum.COLLECTION:
            entityName = CollectionEntity.name;
            break;
        default:
            throw new NotFoundException('ENTITY_NOT_FOUND');

    }

    return entityName;
};