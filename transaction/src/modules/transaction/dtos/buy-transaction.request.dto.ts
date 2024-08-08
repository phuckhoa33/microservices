import {ApiProperty} from "@nestjs/swagger";
import {TransactionTypeEnum} from "../constants/transaction-type.enum.constant";
import {CurrencyStatusEnum} from "../../../shared/enum/currency-enum";
import {AbstractTransactionRequestDto} from "../abstract/dtos/abstract-transaction.request.dto";

export class BuyTransactionRequestDto extends AbstractTransactionRequestDto{
    // TO destination
    @ApiProperty({
        description: 'To destination',
        required: true,
        example: 'Admin wallet',
    })
    toDestination: string;
    
    // Buy transaction description
    @ApiProperty({
        description: 'Buy transaction description',
        required: true,
        example: 'Buy transaction',
    })
    transactionDescription: string;
    

    // Transaction type
    @ApiProperty({
        description: 'Transaction type',
        required: true,
        example: TransactionTypeEnum.BUY,
    })
    transactionType: string;

    // Currency 
    @ApiProperty({
        description: 'Currency',
        required: true,
        example: CurrencyStatusEnum.TINI,
    })
    currency: string;
    
    // Cart id
    @ApiProperty({
        description: 'Cart id',
        required: true,
        example: 'fc3001e7-ffe3-4c01-8e5a-237d3ea22226',
    })
    orderId: string;
}