import {ApiBearerAuth, ApiBody, ApiHeaders, ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger';
import {Body, Controller, Delete, HttpCode, Param, Post, UseGuards} from '@nestjs/common';
import {CreateUserRequestDto} from '../dtos/create-user.request.dto';
import {LoginResponseDto} from '../dtos/login.response.dto';
import {ActiveAccountRequestDto} from '../dtos/active-account.request.dto';
import {RefreshTokenRequest} from '../dtos/refresh-token.request';
import {RefreshTokenResponse} from '../dtos/refresh-token.response';
import {VerifyOptRequestDto} from '../dtos/verify-opt.request.dto';
import {UserAuthService} from '../services/user-auth.service';
import {AccessTokenGuard} from '../../../common/auth/guards/accessToken.guard';
import {ActiveAccountResponseDto} from '../dtos/active-account.response.dto';
import {UpdateActiveAccountRequestDto} from '../dtos/update-active-account.request.dto';
import {UserIdFromAccessToken} from '../../../common/request/decorators/user-id.decorator';
import {ForgotPasswordRequestDto} from '../dtos/forgot-password.request.dto';
import {ResetPasswordRequestDto} from '../dtos/reset-password.request.dto';
import {CheckUserExistRequestDto} from '../dtos/check-user-exist.request.dto';
import {CheckInForgottenPasswordProgressRequestDto} from '../dtos/check-in-forgot-password-progress.request.dto';
import {LoginV2RequestDto} from '../dtos/login.v2.request.dto';
import {DeviceTypeEnum} from '../constants/device.enum';
import {GetXDeviceIdHeader} from '../../../common/request/decorators/get-x-device-id-header.decorator';
import {GetUserAgentDecorator} from '../../../common/request/decorators/get-user-agent.decorator';

@ApiTags('user.auth')
@ApiBearerAuth()
@Controller({
    version: '1',
    path: '/user',
})
export class UserAuthV1Controller {
    constructor(private readonly userAuthService: UserAuthService) {
    }

    // Check isInSignupProgress
    @Post('/is-exist')
    @ApiOperation({
        summary: 'Check is in user exist',
        description: '### Check is in user exist ',
    })
    @ApiResponse({
        status: 201,
        description: 'True',
    })
    @ApiResponse({
        status: 409,
        description: 'False',
    })
    @HttpCode(200)
    async isInSignupProgress(@Body() dto: CheckUserExistRequestDto): Promise<boolean> {
        return await this.userAuthService.checkUserExist(dto);
    }

    // Sign up
    @Post('/sign-up')
    @ApiOperation({
        summary: 'Sign up',
        description: '### Sign up',
    })
    @ApiResponse({
        status: 201,
        description: 'Sign up successfully',
    })
    @ApiResponse({
        status: 409,
        description: 'User already exists',
    })
    async signUp(@Body() user: CreateUserRequestDto): Promise<void> {
        await this.userAuthService.registerUser(user);
    }

    @Post('/login')
    @ApiOperation({
        summary: 'Login',
        description: '### Login',
    })
    @ApiHeaders([
        {
            name: 'x-device-id',
            description: 'Device ID',
            required: true,
        },
    ])
    @ApiBody({
        type: LoginV2RequestDto,
        examples: {
            'example1': {
                value: {
                    phoneNumber: '84123456789',
                    password: '123456@Abc',
                    deviceType: DeviceTypeEnum.DESKTOP_BROWSER,
                },
            },
            'example2': {
                value: {
                    phoneNumber: '84987654321',
                    password: '123456@Abc',
                    deviceType: DeviceTypeEnum.MOBILE_APP,
                },
            },
        },
    })
    @ApiResponse({
        status: 200,
        description: 'Login successfully',
    })
    @ApiResponse({
        status: 400,
        description: 'User or password is incorrect',
    })
    @HttpCode(200)
    async login(@Body() dto: LoginV2RequestDto, @GetXDeviceIdHeader() deviceId: string, @GetUserAgentDecorator() userAgent: string): Promise<LoginResponseDto> {
        return await this.userAuthService.login(dto, deviceId, userAgent);
    }

    @Post('/logout')
    @ApiOperation({
        summary: 'Logout',
        description: '### Logout',
    })
    @ApiResponse({
        status: 200,
        description: 'Logout successfully',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    @ApiHeaders([
        {
            name: 'x-device-id',
            description: 'Device ID',
            required: true,
        },
    ])
    @UseGuards(AccessTokenGuard)
    async logout(@UserIdFromAccessToken() userId: string, @GetXDeviceIdHeader() deviceId: string): Promise<void> {
        await this.userAuthService.revokeRefreshToken(userId, deviceId);
    }

    // Forgot password
    @Post('/forgot-password')
    @ApiOperation({
        summary: 'Forgot password',
        description: '### Forgot password',
    })
    @ApiResponse({
        status: 200,
        description: 'Send otp is successfully',
    })
    @ApiResponse({
        status: 400,
        description: 'Phone number or username is incorrect',
    })
    @HttpCode(200)
    async forgotPassword(@Body() dto: ForgotPasswordRequestDto): Promise<void> {
        await this.userAuthService.forgotPassword(dto);
    }

    // Check is in forgot password progress
    @Post('/is-in-forgotten-password-progress')
    @ApiOperation({
        summary: 'Check : Do user process forgot password progress',
        description: `### Check : Do user process forgot password progress`,
    })
    @ApiResponse({
        status: 200,
        description: 'True',
    })
    @ApiResponse({
        status: 400,
        description: 'False',
    })
    async isInForgottenPasswordProgress(@Body() dto: CheckInForgottenPasswordProgressRequestDto): Promise<boolean> {
        return await this.userAuthService.isInForgottenPasswordProgress(dto);
    }

    // Reset password
    @Post('/reset-password')
    @ApiOperation({
        summary: 'Reset password',
        description: `### Reset password
    Use before API: /user/forgot-password`,
    })
    @ApiResponse({
        status: 200,
        description: 'Reset password is successfully',
    })
    @ApiResponse({
        status: 404,
        description: 'User not found',
    })
    @HttpCode(200)
    async resetPassword(@Body() dto: ResetPasswordRequestDto): Promise<void> {
        await this.userAuthService.resetPassword(dto);
    }


    // Refresh token
    @Post('/refresh-token')
    @ApiOperation({
        summary: 'Refresh token',
        description: '### Refresh token',
    })
    @ApiBody({
        type: RefreshTokenRequest,
        examples: {
            'example1': {
                value: {
                    refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluIiwic3ViIjoiNWQyMTA1NTQtMmZkNC00MDE1LTg2OGUtZGFjZmE4ZWEyOTc4IiwiaXNBZG1pbiI6dHJ1ZSwiaWF0IjoxNzE5ODkwNDQyLCJleHAiOjE3MjA0OTUyNDJ9.KCYQOwtlhmKLl_mMHFefgqy_Qoq2ZHDkBseHVXbw3Z8',
                    accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluIiwic3ViIjoiNWQyMTA1NTQtMmZkNC00MDE1LTg2OGUtZGFjZmE4ZWEyOTc4IiwiaXNBZG1pbiI6dHJ1ZSwiaWF0IjoxNzE5ODkwNDQyLCJleHAiOjE3MTk4OTA1MDJ9.AqXEtaHi3ffeRKK0QkNayDQxsTPCypwObEGx14jcVPs',
                },
            },
        },
    })
    @ApiResponse({
        status: 200,
        description: 'Refresh token successfully',
        type: RefreshTokenResponse
    })
    @HttpCode(200)
    async refreshToken(
        @Body() dto: RefreshTokenRequest,
        @GetXDeviceIdHeader() deviceId: string,
    ): Promise<RefreshTokenResponse> {
        return await this.userAuthService.newAccessToken(dto, deviceId);
    }

    // Verify OTP
    @Post('/verify-otp')
    @ApiOperation({
        summary: 'Verify OTP',
        description: `### Verify OTP
    Use before API: /user/active-account`,
    })
    @ApiResponse({
        status: 200,
        description: 'Verify OTP successfully',
    })
    @ApiResponse({
        status: 400,
        description: 'User does not exist or OTP is incorrect',
    })
    @HttpCode(200)
    async verifyOtp(@Body() dto: VerifyOptRequestDto): Promise<boolean> {
        return await this.userAuthService.verifyOtp(dto);
    }


    // Active account
    @Post('/check-active-account')
    @ApiOperation({
        summary: 'Active account',
        description: `### Active account
    Use after API: /user/check-verify-otp, in this API, it will check your account and activeOtp`,
    })
    @ApiResponse({
        status: 200,
        description: 'Active account is invalid',

    })
    @ApiResponse({
        status: 400,
        description: 'User does not exist or OTP is incorrect',
    })
    @HttpCode(200)
    async checkActiveAccount(@Body() dto: ActiveAccountRequestDto): Promise<ActiveAccountResponseDto> {
        return await this.userAuthService.checkUserAndActiveOtp(dto);
    }

    // Active account
    @Post('/active-account')
    @ApiOperation({
        summary: 'Active account',
        description: `### Active account
    Use after API: /user/verify-otp, in this API, it will change password for user`,
    })
    @ApiResponse({
        status: 200,
        description: 'Active account successfully',
    })
    @ApiResponse({
        status: 400,
        description: 'User does not exist or OTP is incorrect',
    })
    @HttpCode(200)
    async activeAccount(@Body() dto: UpdateActiveAccountRequestDto): Promise<void> {
        return await this.userAuthService.activeAccountAndChangePassword(dto);
    }

    // Resend OTP to active account
    @Post('/resend-otp/:userEmail')
    @ApiOperation({
        summary: 'Resend OTP',
        description: `### Resend OTP`,
    })
    @ApiResponse({
        status: 200,
        description: 'Resend OTP successfully',
    })
    @ApiResponse({
        status: 400,
        description: 'User does not exist',
    })
    @HttpCode(200)
    async resendOtp(@Param('userEmail') userEmail: string): Promise<void> {
        return await this.userAuthService.resendOtp(userEmail);
    }

    // Self delete user
    @Delete('/delete')
    @ApiOperation({
        summary: 'Delete user',
    })
    @ApiResponse({
        status: 200,
        description: 'Delete user successfully',
    })
    @ApiResponse({
        status: 404,
        description: 'User does not exist',
    })
    @UseGuards(AccessTokenGuard)
    async deleteUser(@UserIdFromAccessToken() userId: string) {
        return await this.userAuthService.selfDeleteUser(userId);
    }
}
