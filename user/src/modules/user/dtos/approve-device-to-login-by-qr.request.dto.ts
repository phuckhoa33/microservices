import {ApiProperty} from '@nestjs/swagger';

export class ApproveDeviceToLoginByQrRequestDto {
    @ApiProperty({
        description: 'Login code',
        required: true,
    })
    loginCode: string;
}