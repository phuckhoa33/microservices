import {ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags} from '@nestjs/swagger';
import {Body, Controller, Delete, Get, Post, Put, Query, Req, UseGuards,} from '@nestjs/common';
import {Request} from 'express';
import {UserMyService} from '../services/user-my.service';
import {AccessTokenGuard} from '../../../common/auth/guards/accessToken.guard';
import {ChangePasswordRequestDto} from '../dtos/change-password.request.dto';
import {UserIdFromAccessToken} from '../../../common/request/decorators/user-id.decorator';
import {UpdateShortNameRequestDto} from '../dtos/update-shortName.request.dto';
import {UpdateUserV2RequestDto} from '../dtos/update-user.v2.request.dto';
import {UpdateUserProfileImageNameRequestDto} from '../dtos/update-user-profile-image-name.request.dto';
import {ViewUserProfileResponseDto} from "../dtos/view-user-profile.response.dto";

@ApiTags('user.me')
@ApiBearerAuth()
@Controller({
    version: '1',
    path: '/user',
})
export class UserMeV1Controller {
    constructor(
        private readonly userProfileService: UserMyService,
    ) {
    }

    // Change password
    @ApiOperation({
        summary: 'Change password',
    })
    @ApiResponse({
        status: 200,
        description: 'Change password successfully',
    })
    @ApiResponse({
        status: 404,
        description: 'User does not exist',
    })
    @UseGuards(AccessTokenGuard)
    @Post('/change-password')
    async changePassword(
        @Req() req: Request,
        @Body() dto: ChangePasswordRequestDto,
        @UserIdFromAccessToken() userId: string,
    ): Promise<void> {
        return await this.userProfileService.changePassword(userId, dto);
    }


    // Update short name of user
    @Put('/update-shortname')
    @ApiOperation({
        summary: 'Update user (just shortname)',
    })
    @ApiResponse({
        status: 200,
        description: 'Update user successfully',
    })
    @ApiResponse({
        status: 404,
        description: 'User does not exist',
    })
    @UseGuards(AccessTokenGuard)
    async updateShortName(
        @Req() req: Request,
        @Body() dto: UpdateShortNameRequestDto,
        @UserIdFromAccessToken() userId: string,
    ) {
        await this.userProfileService.updateShortName(dto, userId);
    }


    // Delete image
    @Delete('/remove-image')
    @ApiOperation({
        summary: 'Remove image',
    })
    @ApiResponse({
        status: 200,
        description: 'Remove image successfully',
    })
    @ApiResponse({
        status: 404,
        description: 'User does not exist',
    })
    @UseGuards(AccessTokenGuard)
    async removeImage(@UserIdFromAccessToken() userId: string) {
        await this.userProfileService.removeImage(userId);
    }

    // Get PUT presigned URL
    @Get('/presigned-put-url')
    @ApiOperation({
        summary: 'Get PUT presigned URL',
    })
    @ApiQuery({
        name: 'objectName',
        type: 'string',
        required: true,
    })
    @ApiResponse({
        status: 200,
        description: 'Get PUT presigned URL successfully',
    
    })
    @UseGuards(AccessTokenGuard)
    async getPresignedPutUrl(@Query('objectName') objectName: string, @UserIdFromAccessToken() userId: string) {
        return await this.userProfileService.getPresignedPutUrlForUpdateUserProfile(objectName, userId);
    }

    // New update user information
    @Put('/update-user')
    @ApiOperation({
        summary: 'Update user information',
    })
    @ApiResponse({
        status: 200,
        description: 'Update user information successfully',
    })
    @ApiResponse({
        status: 404,
        description: 'User does not exist',
    })
    @UseGuards(AccessTokenGuard)
    async updateUserV2(
        @Body() dto: UpdateUserV2RequestDto,
        @UserIdFromAccessToken() userId: string,
    ) {
        await this.userProfileService.updateUserV2(dto, userId);
    }

    // New view user profile
    @Get('/view-user-profile')
    @ApiOperation({
        summary: 'View user profile',
    })
    @ApiResponse({
        status: 200,
        description: 'View user profile successfully',
        type: ViewUserProfileResponseDto
    })
    @UseGuards(AccessTokenGuard)
    async viewUserProfile(
        @UserIdFromAccessToken() userId: string,
    ) {
        return await this.userProfileService.viewUserProfile(userId);
    }

    // Update image profile (name only)
    @Put('/update-image-profile')
    @ApiOperation({
        summary: 'Update image profile',
    })
    @ApiResponse({
        status: 200,
        description: 'Update image profile successfully',
    })
    @UseGuards(AccessTokenGuard)
    async updateImageProfile(
        @Body() dto: UpdateUserProfileImageNameRequestDto,
        @UserIdFromAccessToken() userId: string,
    ) {
        return await this.userProfileService.updateImageProfile(userId, dto);
    }
}