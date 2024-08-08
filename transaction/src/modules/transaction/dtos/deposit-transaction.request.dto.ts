import {ApiProperty} from "@nestjs/swagger";
import {TransactionTypeEnum} from "../constants/transaction-type.enum.constant";
import {TransactionCurrencyEnumConstant} from "../constants/transaction-currency.enum.constant";
import {AbstractTransactionRequestDto} from "../abstract/dtos/abstract-transaction.request.dto";

export class DepositTransactionRequestDto extends AbstractTransactionRequestDto{
    // Create dto and integrate with swagger
    
    // From source
    @ApiProperty({
        description: 'From source',
        required: true,
        example: 'Vietcombank',
    })
    fromSource: string;
    
    // TO destination
    @ApiProperty({
        description: 'To destination',
        required: true,
        example: 'Tini wallet',
    })
    toDestination: string;

    // Transaction type
    @ApiProperty({
        description: 'Transaction type',
        required: true,
        example: TransactionTypeEnum.DEPOSIT,
    })
    transactionType: string;

    // Transaction description
    @ApiProperty({
        description: 'Transaction description',
        required: true,
        example: 'Deposit transaction',
    })
    transactionDescription: string;

    // Currency 
    @ApiProperty({
        description: 'Currency',
        required: true,
        example: TransactionCurrencyEnumConstant.VND,
    })
    currency: string;

}