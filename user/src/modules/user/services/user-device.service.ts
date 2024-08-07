// import { Injectable, NotFoundException } from '@nestjs/common';
// import { AcceptAccessPermissionRequestDto } from '../dtos/accept-access-permission.request.dto';
// import { Model } from 'mongoose';
// import { InvestorEntity } from '../entities/investor.entity';
// import { detectDeviceInfoShared } from '../../shared/detect-device-info.shared';
// import * as admin from 'firebase-admin';
// import { DEVICE_TYPE } from '../constants/device.constant';
// import { randomNumberShared } from '../../shared/random-number.shared';
// import { GetShortenTokenRequestDto } from '../dtos/get-shorten-token.request.dto';
// import { UpdateDeviceIdRequestDto } from '../dtos/update-device-id.request.dto';
// import { DatabaseModel } from '../../../common/database/decorators/database.decorator';
//
// @Injectable()
// export class UserDeviceService {
//   constructor(
//     @DatabaseModel(InvestorEntity) private readonly userModel: Model<InvestorEntity>,
//   ) {
//   }
//
//
//   /**
//    * Accept access permission
//    * @param {AcceptAccessPermissionRequestDto} dto
//    * @param {String} userId
//    * */
//   async acceptAccessPermission(dto: AcceptAccessPermissionRequestDto, userId: string) {
//     // Check user exist
//     const user = await this.userModel.findById({ _id: userId }).exec();
//     const clientDevice = await this.deviceModel.findOne({ shortenToken: dto.token }).exec();
//     if (!user || !clientDevice)
//       throw new NotFoundException('USER_OR_DEVICE_NOT_FOUND');
//
//     const payload = {
//       token: clientDevice._id,
//       notification: {
//         title: 'Notify request from account',
//         body: 'You have been approved this account"s access',
//       },
//       data: {
//         deviceId: clientDevice._id,
//         isAccepted: true + '',
//       },
//     };
//
//     // Update firebase token and shorten token of client device
//     await this.deviceModel.updateOne({ _id: clientDevice._id }, { shortenToken: null });
//
//     return admin.messaging().send(payload).then((res) => {
//       return {
//         success: true,
//       };
//
//     }).catch((error) => {
//       return {
//         success: false,
//       };
//     });
//
//     // TODO: This part have established with socket protocol, will convert if the application need to have
//     // // Establish client properties
//     // let ioClient: Socket = io(`localhost:${process.env.APP_ENV}`, {
//     //   autoConnect: false,
//     //   transports: ['websocket', 'polling'],
//     // });
//     //
//     // // Connect client socket
//     // ioClient.connect();
//     //
//     // // Send message for pool channel
//     // ioClient.emit('pool', JSON.stringify(dto));
//     //
//     // // Listen result of sending action
//     // let checkedSessionIdValid = true;
//     //
//     // ioClient.on('result', async(data) => {
//     //   if(!data?.deviceInfo) {
//     //     checkedSessionIdValid = false;
//     //     return;
//     //   }
//     //   // Check this device have existed
//     //   let device = await this.deviceModel.findOne({deviceId: data.deviceInfo?.deviceId}).exec();
//     //   if(!device){
//     //     // Get existed deviceId
//     //     let deviceId = (await this.deviceModel.findOne({ _id: { $in: user.devices } }).exec())?.deviceId;
//     //     // Create new device
//     //     device = await this.createDevice(data.deviceInfo?.userAgent, user._id, deviceId);
//     //   }
//     // });
//     //
//     // // Wait for getting value after listening result channel
//     // await sleepTimeShared(10);
//     //
//     // // Check device info exist
//     // if(!checkedSessionIdValid) 
//     //   throw new BadRequestException("SESSION_ID_INVALID");
//     //
//     // // Update refresh token
//     // await this.userModel.updateOne({phoneNumber: dto.phoneNumber}, {refreshTokens: dto.refreshToken});
//     //
//     // // Disconnect client socket
//     // ioClient.disconnect();
//
//
//   }
//
//   /**
//    * Update device id
//    * @param {UpdateDeviceIdRequestDto} dto
//    * @param {String} userAgent
//    * */
//   async updateDeviceId(dto: UpdateDeviceIdRequestDto, userAgent: string) {
//     /* Check device id
//     . If device id is not existed
//     , We will create new device */
//     const device = await this.deviceModel.findOne({ deviceId: dto.oldDeviceId }).exec();
//     if (!device) {
//       const deviceInfo = detectDeviceInfoShared(userAgent);
//       await this.deviceModel.create({
//         accessType: deviceInfo?.client?.type,
//         deviceType: deviceInfo?.device?.type ? deviceInfo?.device?.type : DEVICE_TYPE.MOBILE_PHONE,
//         os: deviceInfo?.os?.name,
//         accessTypeName: deviceInfo?.client?.name,
//         deviceId: dto.newDeviceId,
//       });
//     }
//
//     // Update device id 
//     await this.deviceModel.updateOne({ deviceId: dto.oldDeviceId }, { deviceId: dto.newDeviceId }).exec();
//   }
//
//   /**
//    * Get shorten token
//    * @param {GetShortenTokenRequestDto} dto
//    * @param {String} deviceId
//    * */
//   async getShortenToken(dto: GetShortenTokenRequestDto, deviceId: string) {
//     // Check device
//     const device = await this.deviceModel.findById(deviceId).exec();
//     if (!device)
//       throw new NotFoundException('NOT_FOUND_DEVICE');
//
//     // check token is existed
//     let randomToken = randomNumberShared(6);
//
//     await this.deviceModel.updateOne({ _id: dto.token }, { shortenToken: randomToken, firebaseToken: dto.token });
//
//     return randomToken;
//   }
//
// }