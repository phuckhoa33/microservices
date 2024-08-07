import {AutoMap} from '@automapper/classes';
import {IResponseMinioFileFormat} from '../../../shared/interfaces/response-minio-file-format.interface';

export class ViewUserProfileV2ResponseDto {
    @AutoMap()
    _id: string;

    @AutoMap()
    email: string;

    @AutoMap()
    phoneNumber: string;

    @AutoMap()
    shortName: string;

    @AutoMap()
    walletId: string;

    @AutoMap()
    fullName: string;

    @AutoMap()
    address: string;

    @AutoMap()
    dateOfBirth: string;

    @AutoMap()
    gender: string;

    @AutoMap()
    idCard: string;

    @AutoMap()
    interesting: [];

    @AutoMap()
    job: string;

    @AutoMap()
    createdAt: Date;

    @AutoMap()
    imageProfile: IResponseMinioFileFormat;
}
