import {ApiProperty} from '@nestjs/swagger';

export class LikeNftRequestDto {
    @ApiProperty({
        required: false,
        description: 'NFT Id',
        example: 'afassssssssssf2w222222222222222faf',
    })
    readonly nftId?: string;
}