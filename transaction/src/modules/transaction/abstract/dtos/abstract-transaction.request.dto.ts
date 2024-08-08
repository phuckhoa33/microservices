import {IsPositive, Min} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export abstract class AbstractTransactionRequestDto {
    // Create dto and integrate with swagger
    // Amount
    @ApiProperty({
        description: 'Amount',
        required: true,
        example: 1000,
    })
    @IsPositive()
    @Min(1)
    amount: number;

    // Transaction method
    @ApiProperty({
        description: 'Transaction method',
        required: true,
        example: 'paypal',
    })
    transactionMethod: string;

    // Transaction fee
    @ApiProperty({
        description: 'Transaction fee',
        required: true,
        example: 10,
    })
    @IsPositive()
    @Min(1)
    transactionFee: number;
}