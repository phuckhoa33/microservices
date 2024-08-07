import {AutoMap} from "@automapper/classes";
import {ApiProperty} from "@nestjs/swagger";
import {TransactionStatusEnum} from "../constants/transaction-status.enum.constant";
import {TransactionTypeEnum} from "../constants/transaction-type.enum.constant";

export class ViewTransactionFromUserViewResponseDto {
    @AutoMap()
    @ApiProperty({
        description: 'Transaction id',
        example: '8cfaef71-21d8-420c-beb9-d09ae2b4d4fa',
        required: true,
    })
    _id: string;

    @AutoMap()
    @ApiProperty({
        description: 'User id',
        example: '377eaa16-27b0-444f-acb1-171e105572a6',
        required: true,
    })
    userId: string;

    @AutoMap()
    @ApiProperty({
        description: 'NFT id',
        example: 'fc3001e7-ffe3-4c01-8e5a-237d3ea22226',
        required: true,
    })
    nftId: string;

    @AutoMap()
    @ApiProperty({
        description: 'Amount',
        example: '1000',
        required: true,
    })
    amount: string;

    @AutoMap()
    @ApiProperty({
        description: 'Status',
        example: TransactionStatusEnum.SUCCESS,
        required: true,
    })
    status: string;

    // Transaction type
    @AutoMap()
    @ApiProperty({
        description: 'Transaction type',
        example: TransactionTypeEnum.DEPOSIT,
        required: true,
    })
    transactionType: string;

    @AutoMap()
    @ApiProperty({
        description: 'Transaction date',
        example: '2021-10-10T10:10:10',
        required: true,
    })
    transactionDate: string;

    // Transaction description
    @AutoMap()
    @ApiProperty({
        description: 'Transaction description',
        example: 'Deposit money',
        required: true,
    })
    transactionDescription: string;

    // Transaction method
    @AutoMap()
    @ApiProperty({
        description: 'Transaction method',
        example: 'Paypal',
        required: true,
    })
    transactionMethod: string;

    // Transaction fee
    @AutoMap()
    @ApiProperty({
        description: 'Transaction fee',
        example: '10',
        required: true,
    })
    transactionFee: string;

    // Currency
    @AutoMap()
    @ApiProperty({
        description: 'Currency',
        example: 'USD',
        required: true,
    })
    currency: string;
    
    // from source
    @AutoMap()
    @ApiProperty({
        description: 'From source',
        example: 'Vietcombank',
        required: true,
    })
    fromSource: string;
    
    // to destination
    @AutoMap()
    @ApiProperty({
        description: 'To destination',
        example: 'Tini wallet',
        required: true,
    })
    toDestination: string;

    @AutoMap()
    @ApiProperty({
        description: 'Created at',
        example: '2021-10-10T10:10:10',
        required: true,
    })
    createdAt: string;
}