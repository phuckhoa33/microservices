import {ApiProperty} from '@nestjs/swagger';

export class UpdateUserProfileImageNameRequestDto {
    @ApiProperty({
        description: 'User profile image name',
        example: '1634025600000',
        required: true,
        nullable: false,
    })
    imageProfile: string;
}