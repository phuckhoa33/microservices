import {PageOptionsDto} from "../../../common/pagination/dtos/page-options.dto";
import {ApiProperty} from "@nestjs/swagger";
import {TransactionStatusEnum} from "../constants/transaction-status.enum.constant";
import {TransactionTypeEnum} from "../constants/transaction-type.enum.constant";

export class GetAllTransactionsRequestDto extends PageOptionsDto {
    @ApiProperty({
        required: false,
        description: 'Transaction status',
        enum: Object.values(TransactionStatusEnum),
        example: TransactionStatusEnum.ALL,
    })
    readonly status?: TransactionStatusEnum;

    @ApiProperty({
        required: false,
        description: 'Transaction type',
        enum: Object.values(TransactionTypeEnum),
        example: TransactionTypeEnum.ALL,
    })
    readonly transactionType?: TransactionTypeEnum;
}