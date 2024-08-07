import {AutomapperProfile, InjectMapper} from '@automapper/nestjs';
import {createMap, forMember, mapFrom, Mapper, MappingProfile} from '@automapper/core';
import {InvestorEntity} from '../entities/investor.entity';
import {ViewUserProfileResponseDto} from '../dtos/view-user-profile.response.dto';
import {UpdateUserV2RequestDto} from '../dtos/update-user.v2.request.dto';
import {ViewUserProfileV2ResponseDto} from '../dtos/view-user-profile.v2.response.dto';
import {MinioClientService} from '../../../common/minio-client/services/minio-client.service';
import {MinioFolderEnum} from '../../../shared/enum/minio-folder-enum';

export class UserProfile extends AutomapperProfile {
    constructor(
        @InjectMapper() mapper: Mapper,
        private readonly minoClientService: MinioClientService,
    ) {
        super(mapper);
    }

    override get profile(): MappingProfile {
        return (mapper) => {
            createMap(
                mapper,
                InvestorEntity,
                ViewUserProfileResponseDto,
                forMember(
                    (dest) => dest._id,
                    mapFrom((src) => src._id as unknown as string),
                ),
                forMember(
                    (dest: any) => dest.roles,
                    mapFrom(
                        (src) =>
                            JSON.parse(JSON.stringify(src.roles))
                                ?.map((role: string) => {
                                    return role;
                                })
                                .join(', '),
                    ),
                ),
                forMember(
                    (dest) => dest?.image,
                    mapFrom((src) => src?.image as unknown as Buffer),
                ),
                forMember(
                    (dest) => dest?.interesting,
                    mapFrom((src) => src?.interesting as unknown as string),
                ),
                forMember(
                    (dest) => dest?.job,
                    mapFrom((src) => src?.job as unknown as string),
                ),
                forMember(
                    (dest) => dest?.createdAt,
                    mapFrom((src) => src?.createdAt as unknown as string),
                ),
            );
            createMap(
                mapper,
                UpdateUserV2RequestDto,
                InvestorEntity,
            );
            createMap(
                mapper,
                InvestorEntity,
                ViewUserProfileV2ResponseDto,
                forMember(
                    (dest: any) => dest.roles,
                    mapFrom(
                        (src) =>
                            JSON.parse(JSON.stringify(src.roles))
                                ?.map((role: string) => {
                                    return role;
                                })
                                .join(', '),
                    ),
                ),
                // Map image to URL, example: http://localhost:9000/5f9b3b7b7f7b7d001f7b7f7b/5f9b3b7b7f7b7d001f7b7f7b
                forMember(
                    (dest: ViewUserProfileV2ResponseDto) => dest?.imageProfile,
                    mapFrom((src: InvestorEntity) => src?.imageProfile ? {
                        url: this.minoClientService.getFileUrl(`${MinioFolderEnum.INVESTOR_FOLDER}/${src._id}/${src?.imageProfile}`),
                        fileName: src?.imageProfile,
                    } : null),
                ),
                forMember(
                    (dest: ViewUserProfileV2ResponseDto) => dest?.interesting,
                    mapFrom((src: InvestorEntity) => src?.interesting.map((interest: string) => interest)),
                ),
            );
        };
    }
}
