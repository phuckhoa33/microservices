import {AutomapperProfile, InjectMapper} from "@automapper/nestjs";
import {createMap, Mapper, MappingProfile} from "@automapper/core";
import {WalletEntity} from "../entities/wallet.entity";
import {ViewWalletFromUserViewResponseDto} from "../dtos/view-wallet-from-user-view.response.dto";

export class WalletProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    get profile(): MappingProfile {
        return (mapper) => {
            createMap(
                mapper,
                WalletEntity,
                ViewWalletFromUserViewResponseDto
            )
        }
    }
}