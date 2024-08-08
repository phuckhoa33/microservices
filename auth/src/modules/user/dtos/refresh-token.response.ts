import {ApiProperty} from "@nestjs/swagger";

export class RefreshTokenResponse {
    @ApiProperty({
        description: 'Access token',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluIiwic3ViIjoiNWQyMTA1NTQtMmZkNC00MDE1LTg2OGUtZGFjZmE4ZWEyOTc4IiwiaXNBZG1pbiI6dHJ1ZSwiaWF0IjoxNzE5ODkwNDQyLCJleHAiOjE3MjA0OTUyNDJ9.KCYQOwtlhmKLl_mMHFefgqy_Qoq2ZHDkBseHVXbw3Z8',
        required: true,
    })
    accessToken: string;

    @ApiProperty({
        description: 'Refresh token',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluIiwic3ViIjoiNWQyMTA1NTQtMmZkNC00MDE1LTg2OGUtZGFjZmE4ZWEyOTc4IiwiaXNBZG1pbiI6dHJ1ZSwiaWF0IjoxNzE5ODkwNDQyLCJleHAiOjE3MTk4OTA1MDJ9.AqXEtaHi3ffeRKK0QkNayDQxsTPCypwObEGx14jcVPs',
        required: true,
    })
    refreshToken: string;
}
