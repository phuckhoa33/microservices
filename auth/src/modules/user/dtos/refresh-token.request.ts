import {ApiProperty} from '@nestjs/swagger';

export class RefreshTokenRequest {
    @ApiProperty({
        required: true,
        type: String,
    })
    accessToken: string;

    @ApiProperty({
        required: true,
        type: String,
    })
    refreshToken: string;
}
