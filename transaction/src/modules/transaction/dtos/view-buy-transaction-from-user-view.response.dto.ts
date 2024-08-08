import {ViewTransactionFromUserViewResponseDto} from "./view-transaction-from-user-view.response.dto";
import {AutoMap} from "@automapper/classes";
import {ApiProperty} from "@nestjs/swagger";

export class ViewBuyTransactionFromUserViewResponseDto extends ViewTransactionFromUserViewResponseDto {
    // from source
    @AutoMap()
    @ApiProperty({
        description: 'From source which user"s wallet id will be deducted.',
        example: 'fc3001e7-ffe3-4c01-8e5a-237d3ea22226',
        required: true,
    })
    fromSource: string;

    // to destination
    @AutoMap()
    @ApiProperty({
        description: 'To destination which admin"s wallet id will be deducted',
        example: 'fc3001e7-ffe3-4c01-8e5a-237d3ea22226',
        required: true,
    })
    toDestination: string;
    
    @AutoMap()
    @ApiProperty({
        description: 'qualityOfNFT',
        example: '100',
    })
    qualityOfNFT: string;
    
    @AutoMap()
    @ApiProperty({
        description: 'Transaction description.',
        example: 'Buy transaction',
    })
    transactionDescription: string;
    
    // List of NFTs
    @AutoMap()
    @ApiProperty({
        description: 'List of NFTs',
        example: ['fc3001e7-ffe3-4c01-8e5a-237d3ea22226', 'fc3001e7-ffe3-4c01-8e5a-237d3ea22226'],
    })
    listOfNFTs: string[];
    
    @AutoMap()
    @ApiProperty({
        description: 'Order id that user used to buy nft.',
        example: 'fc3001e7-ffe3-4c01-8e5a-237d3ea22226',
    })
    orderId: string;
}