import {AutoMap} from "@automapper/classes";
import {ApiProperty} from "@nestjs/swagger";

export class DepositTransactionResponseDto {
    // transactionId 
    @AutoMap()
    @ApiProperty({
        description: 'Transaction id',
        required: true,
        example: '60f4e3b5e6e7c7000f4e3b5e',
    })
    transactionId: string;
}