import {AutoMap} from "@automapper/classes";
import {ApiProperty} from "@nestjs/swagger";
import {CurrencyStatusEnum} from "../../../shared/enum/currency-enum";

export class ViewWalletFromUserViewResponseDto {
    // Wallet balance 
    @AutoMap()
    @ApiProperty({
        description: 'Wallet balance',
        example: '1000',
        required: true,
    })
    balance: string;

    // Wallet currency
    @AutoMap()
    @ApiProperty({
        description: 'Wallet currency',
        example: CurrencyStatusEnum.TINI,
        required: true,
    })
    currency: string;

    // Wallet status
    @AutoMap()
    @ApiProperty({
        description: 'Wallet status',
        example: 'active',
        required: true,
    })
    status: string;

    // Wallet type
    @AutoMap()
    @ApiProperty({
        description: 'Wallet type',
        example: 'user',
        required: true,
    })
    type: string;

    @AutoMap()
    @ApiProperty({
        description: 'Wallet id',
        example: '8cfaef71-21d8-420c-beb9-d09ae2b4d4fa',
        required: true,
    })
    createdAt: string;

    @AutoMap()
    // Deleted at
    @ApiProperty({
        description: 'Deleted at',
        example: '2021-10-10T10:10:10',
        required: true,
    })
    deletedAt: string;
}