import {createMap, forMember, mapFrom, Mapper, MappingProfile} from "@automapper/core";
import {AutomapperProfile, InjectMapper} from "@automapper/nestjs";
import {TransactionEntity} from "../entities/transaction.entity";
import {ViewTransactionFromUserViewResponseDto} from "../dtos/view-transaction-from-user-view.response.dto";
import {ViewBuyTransactionFromUserViewResponseDto} from "../dtos/view-buy-transaction-from-user-view.response.dto";
export class TransactionProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    get profile(): MappingProfile {
        return (mapper) => {
            createMap(
                mapper,
                TransactionEntity,
                ViewTransactionFromUserViewResponseDto,
                forMember(
                    (dest: ViewTransactionFromUserViewResponseDto) => dest.transactionDescription,
                    mapFrom((src: any) => src.transactionDescription),
                ),
            )
            createMap(
                mapper,
                TransactionEntity,
                ViewBuyTransactionFromUserViewResponseDto,
                forMember(
                    (dest: ViewTransactionFromUserViewResponseDto) => dest.transactionDescription,
                    mapFrom((src: any) => src.transactionDescription),
                ),
                forMember(
                    (dest: ViewBuyTransactionFromUserViewResponseDto) => dest.orderId,
                    mapFrom((src: any) => src.orderId),
                ),
                forMember(
                    (dest: ViewBuyTransactionFromUserViewResponseDto) => dest.listOfNFTs,
                    mapFrom((src: any) => src.listOfNFTs),
                ),
            )
        }
    }
}