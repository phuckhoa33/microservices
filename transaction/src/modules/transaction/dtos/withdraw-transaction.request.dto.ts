import {ApiProperty} from "@nestjs/swagger";
import {TransactionCurrencyEnumConstant} from "../constants/transaction-currency.enum.constant";
import {TransactionTypeEnum} from "../constants/transaction-type.enum.constant";
import {AbstractTransactionRequestDto} from "../abstract/dtos/abstract-transaction.request.dto";

export class WithdrawTransactionRequestDto extends AbstractTransactionRequestDto{
    // Create dto and integrate with swagger

    // From source
    @ApiProperty({
        description: 'From source',
        required: true,
        example: 'Tini wallet',
    })
    fromSource: string;

    // TO destination
    @ApiProperty({
        description: 'To destination',
        required: true,
        example: 'Vietcombank',
    })
    toDestination: string;

    // Transaction type
    @ApiProperty({
        description: 'Transaction type',
        required: true,
        example: TransactionTypeEnum.WITHDRAW,
    })
    transactionType: string;

    // Transaction description
    @ApiProperty({
        description: 'Withdraw transaction description',
        required: true,
        example: 'Withdraw transaction',
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