import {Body, Controller, Post, UseGuards} from '@nestjs/common';
import {ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger';
import {UserAuthQrService} from '../services/user-auth-qr.service';
import {ApproveDeviceToLoginByQrRequestDto} from '../dtos/approve-device-to-login-by-qr.request.dto';
import {UserIdFromAccessToken} from '../../../common/request/decorators/user-id.decorator';
import {AccessTokenGuard} from '../../../common/auth/guards/accessToken.guard';
import {GetUserInfoFromLoginCodeResponseDto} from '../dtos/get-user-info-from-login-code.response.dto';

@ApiTags('user.auth.qr-login')
@Controller({
    version: '1',
    path: '/user',
})
export class UserQrLoginV1Controller {
    constructor(
        private readonly userAuthQrService: UserAuthQrService,
    ) {
    }

    // Approve device for QR login
    // The FE will call this API to approve the device for QR login, params: {loginCode: string}
    @Post('/approve-device')
    @ApiOperation({
        summary: `### Approve device for QR login`,
        description: `
    ## Use init-login-by-qr-code event and subscribe login-code before calling this API
    This API has event: 
    ## login-by-qr-tokens to return access token and refresh token`,
    })
    @ApiResponse({
        status: 200,
        description: 'Approve device for QR login successfully',
    })
    @ApiBearerAuth()
    @UseGuards(AccessTokenGuard)
    @ApiBody({
        type: ApproveDeviceToLoginByQrRequestDto,
    })
    async approveDeviceForQrLogin(@UserIdFromAccessToken() userId: string, @Body() dto: ApproveDeviceToLoginByQrRequestDto): Promise<void> {
        return await this.userAuthQrService.approveDeviceForQrLogin(userId, dto);
    }

    // From login code, get device info
    @Post('/get-device-info')
    @ApiOperation({
        summary: `### Get device info from login code`,
        description: `Get device info from login code`,
    })
    @ApiResponse({
        status: 200,
        description: 'Get device info successfully',
    })
    @ApiBearerAuth()
    @UseGuards(AccessTokenGuard)
    @ApiBody({
        type: ApproveDeviceToLoginByQrRequestDto,
    })
    async getDeviceInfoFromLoginCode(@Body() dto: ApproveDeviceToLoginByQrRequestDto): Promise<GetUserInfoFromLoginCodeResponseDto> {
        return await this.userAuthQrService.getDeviceInfoFromLoginCode(dto);
    }
}