// import { Body, Controller, HttpCode, Patch, Post, Req, UseGuards } from '@nestjs/common';
// import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
// import { AcceptAccessPermissionRequestDto } from '../dtos/accept-access-permission.request.dto';
// import { AccessTokenGuard } from '../../../common/auth/guards/accessToken.guard';
// import { Request } from 'express';
// import { UserIdFromAccessToken } from '../../../common/request/decorators/user-id.decorator';
// import { GetShortenTokenRequestDto } from '../dtos/get-shorten-token.request.dto';
// import { DeviceIdDecorator } from '../../../common/request/decorators/device-id.decorator';
// import { UpdateDeviceIdRequestDto } from '../dtos/update-device-id.request.dto';
//
// @ApiTags('user.devices')
// @ApiBearerAuth()
// @Controller({
//   version: '1',
//   path: '/user',
// })
// export class UserDeviceV1Controller {
//
//   constructor(private readonly userDeviceService: UserDeviceService) {
//   }
//
//   // Accept access permission
//   @Post('/accept-access')
//   @ApiOperation({
//     summary: 'Accept access permission',
//     description: '### Accept access permission',
//   })
//   @ApiResponse({
//     status: 200,
//     description: 'Accept access permission successfully',
//   })
//   @ApiResponse({
//     status: 400,
//     description: 'Account is not found',
//   })
//   @HttpCode(200)
//   @UseGuards(AccessTokenGuard)
//   async acceptAccessPermission(@Body() dto: AcceptAccessPermissionRequestDto, @UserIdFromAccessToken() userId: string) {
//     await this.userDeviceService.acceptAccessPermission(dto, userId);
//   }
//
//   @Post('/get-shorten-token')
//   @ApiOperation({
//     summary: 'Get shorten token',
//     description: '### Get shorten token',
//   })
//   @ApiResponse({
//     status: 200,
//     description: 'Get shorten token successfully',
//   })
//   @ApiResponse({
//     status: 400,
//     description: 'Token is null',
//   })
//   @HttpCode(200)
//   async getShortenToken(@Body() dto: GetShortenTokenRequestDto, @DeviceIdDecorator() deviceId: string) {
//     return await this.userDeviceService.getShortenToken(dto, deviceId);
//   }
//
//   @Patch('/update-device-id')
//   @ApiOperation({
//     summary: 'Update device id',
//     description: '### Update device id',
//   })
//   @ApiResponse({
//     status: 200,
//     description: 'Update device id successfully',
//   })
//   @ApiResponse({
//     status: 400,
//     description: 'Token is null',
//   })
//   @HttpCode(200)
//   async updateDeviceId(@Body() dto: UpdateDeviceIdRequestDto, @Req() req: Request) {
//     return await this.userDeviceService.updateDeviceId(dto, req.headers['user-agent'] ? req.headers['user-agent'] : null);
//   }
// }