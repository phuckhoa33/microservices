import {ApiProperty} from '@nestjs/swagger';

export class LikeCollectionRequestDto {
    @ApiProperty({
        required: false,
        description: 'Collection Id',
    })
    readonly collectionId?: string;
}