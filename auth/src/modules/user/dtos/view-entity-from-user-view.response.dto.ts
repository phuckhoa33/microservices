import {AutoMap} from '@automapper/classes';
import {
    DATABASE_CREATED_AT_FIELD_NAME,
    DATABASE_LAST_MODIFICATION_TIME_FIELD_NAME,
} from '../../../common/database/constants/database-fields.constant';

export class ViewEntityFromUserViewResponseDto {
    @AutoMap()
    _id: string;

    @AutoMap()
    name: string;

    @AutoMap()
    description: string;

    @AutoMap()
    image: string;

    @AutoMap()
    coverImage: string;

    @AutoMap()
    publicPrice: string;

    @AutoMap()
    publicDate: string;

    @AutoMap()
    disabledAccount: boolean;

    @AutoMap()
    categories: string[];

    @AutoMap()
    quantityOfFloor: number;

    @AutoMap()
    quantityOfUnit: number;

    @AutoMap()
    quantityOfNFT: number;

    @AutoMap()
    projectWebsite: string;

    @AutoMap()
    convenientServices: string[];

    @AutoMap()
    documents: string[];

    @AutoMap()
    phoneNumber: string;

    @AutoMap()
    email: string;

    @AutoMap()
    address: string;

    @AutoMap()
    businessSector: string;

    @AutoMap()
    nftOwner: boolean;

    @AutoMap()
    merchantId: string;

    @AutoMap()
    projectId: string;

    @AutoMap()
    collectionId: string;

    @AutoMap()
    status: string;

    @AutoMap()
    [DATABASE_CREATED_AT_FIELD_NAME]: Date;

    @AutoMap()
    [DATABASE_LAST_MODIFICATION_TIME_FIELD_NAME]: Date;

    @AutoMap()
    deletedAt: Date;
}