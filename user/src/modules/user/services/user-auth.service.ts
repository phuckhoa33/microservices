import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import {InvestorEntity} from '../entities/investor.entity';
import {Model} from 'mongoose';
import {AuthService} from '../../../common/auth/services/auth.service';
import {CreateUserRequestDto} from '../dtos/create-user.request.dto';
import {LoginResponseDto} from '../dtos/login.response.dto';
import {ActiveAccountRequestDto} from '../dtos/active-account.request.dto';
import {VerifyOptRequestDto} from '../dtos/verify-opt.request.dto';
import {DefaultRole} from '../../role/constants/role.constant';
import {RoleEntity} from '../../role/entities/role.entity';
import {ActiveAccountResponseDto} from '../dtos/active-account.response.dto';
import {UpdateActiveAccountRequestDto} from '../dtos/update-active-account.request.dto';
import {ForgotPasswordRequestDto} from '../dtos/forgot-password.request.dto';
import {ResetPasswordRequestDto} from '../dtos/reset-password.request.dto';
import {createRandomShortName} from '../../shared/create-random-shortname.shared';
import {CheckUserExistRequestDto} from '../dtos/check-user-exist.request.dto';
import {CheckInForgottenPasswordProgressRequestDto} from '../dtos/check-in-forgot-password-progress.request.dto';
import {IUSerDeviceEntity, UserDeviceEntity} from '../entities/user-device.entity';
import {DatabaseModel} from '../../../common/database/decorators/database.decorator';
import {LoginV2RequestDto} from '../dtos/login.v2.request.dto';
import {DeviceStatusEnum} from '../constants/device.enum';
import {RefreshTokenRequest} from '../dtos/refresh-token.request';
import {RefreshTokenResponse} from '../dtos/refresh-token.response';
import {WalletEntity} from "../../wallet/entities/wallet.entity";


export type Payload = {
    email: string;
    sub: string;
    roles: string[];
    isAdmin?: boolean;
};

@Injectable()
export class UserAuthService {
    constructor(
        @DatabaseModel(InvestorEntity.name) private readonly userModel: Model<InvestorEntity>,
        @DatabaseModel(WalletEntity.name) private readonly walletModel: Model<WalletEntity>,
        @DatabaseModel(UserDeviceEntity.name) private readonly userDeviceModel: Model<UserDeviceEntity>,
        private readonly authService: AuthService,
    ) {
    }

    /**
     * Register user
     * @param {CreateUserRequestDto} dto
     */
    async registerUser(dto: CreateUserRequestDto): Promise<void> {
        // We have two cases:
        // 1. User really not exist
        // 2. User existed but isDeleted = true
        // Find user include deleted user ( match with phoneNumber and isDeleted = true or false)
        const user = await this.userModel.aggregate([
            {
                $match: {
                    phoneNumber: dto.phoneNumber,
                    isDeleted: {$in: [true, false]},
                },
            },
        ]);

        // If user existed and isDeleted = false
        if (user.length > 0 && !user[0].isDeleted) {
            throw new ConflictException('USER_EXISTED');
        }

        // If user existed and isDeleted = true, set isDeleted = false, clear all old data, keep phoneNumber
        if (user.length > 0 && user[0].isDeleted) {
            // Use aggregate to bypass pre save hook and use $set to update
            await this.userModel.aggregate([
                {
                    $match: {
                        phoneNumber: dto.phoneNumber,
                    },
                },
                {
                    $set: {
                        ...dto,
                        isDeleted: false,
                        password: null,
                        roles: [],
                    },
                },
            ]);
        }

        // Hash password
        const hashedPassword = await this.authService.hashData(dto.password);

        // Create short name
        const shortName = 'User' + createRandomShortName(3, 10);

        // Create wallet
        const wallet = await this.walletModel.create({});

        // Cover for current, have not planned for role of normal user, so above always null -> assign a INVESTOR role
        const investorRole = new RoleEntity();
        investorRole.name = DefaultRole.INVESTOR;

        // Create user
        const newUser = await this.userModel.create({
            ...dto,
            walletId: wallet._id,
            password: hashedPassword,
            shortName,
            roles: [investorRole.name],
        });

        // New user image name
        const randomImageName = `profile-${Date.now()}`;
        await this.userModel.updateOne({_id: newUser._id}, {imageProfile: `${randomImageName}`});
    }

    /**
     * Check use exist
     * @param {CheckUserExistRequestDto} dto
     * @return {boolean} false = don't have user account in database, true is existed
     * */
    async checkUserExist(dto: CheckUserExistRequestDto): Promise<boolean> {
        // get user
        const user = await this.userModel.findOne({phoneNumber: dto.phoneNumber}).exec();
        return user !== null;
    }

    async login(dto: LoginV2RequestDto, deviceId: string, userAgent: string): Promise<LoginResponseDto> {
        // If device id is null, throw error: DEVICE_ID_IS_REQUIRED
        if (!deviceId) {
            throw new BadRequestException('DEVICE_ID_IS_REQUIRED');
        }

        // Get user by phone number
        let user = await this.userModel.findOne({phoneNumber: dto.phoneNumber}).populate('roles').exec();

        // If user is null, throw error: USER_OR_PASSWORD_INCORRECT
        if (!user) {
            throw new UnauthorizedException('USER_OR_PASSWORD_INCORRECT');
        }

        // Check password
        const isPasswordCorrect = await this.authService.validateUserPassword(dto.password, user.password);

        // If password is incorrect, throw error: USER_OR_PASSWORD_INCORRECT
        if (!isPasswordCorrect) {
            throw new UnauthorizedException('USER_OR_PASSWORD_INCORRECT');
        }

        // Check if user is disabled
        if (user.disabledAccount) {
            throw new UnauthorizedException('USER_DISABLED');
        }

        // Generate token
        const roleIds = JSON.parse(JSON.stringify(user.roles))?.map(
            (role: RoleEntity) => role._id,
        );

        const payload: Payload = {
            email: user.email,
            sub: user._id,
            roles: roleIds,
        };

        const tokens = await this.authService.generateTokens(payload);

        // Check is device existed
        let device = await this.userDeviceModel.findOne({
            deviceId: deviceId,
            userId: user._id,
        }).exec();

        // If device is null, create new device (use userDevice model) and disable old device
        if (!device) {
            // Find old device same user id and device type, then change status to INACTIVE, refreshToken to null
            await this.userDeviceModel.updateMany({
                userId: user._id,
                deviceType: dto.deviceType,
            }, {deviceStatus: DeviceStatusEnum.INACTIVE, refreshToken: null});

            // Create new device
            const newDevice: IUSerDeviceEntity = {
                userId: user._id,
                deviceType: dto.deviceType,
                deviceId,
                deviceInfo: userAgent,
                refreshToken: tokens.refreshToken,
                deviceStatus: DeviceStatusEnum.ACTIVE,
            };

            await this.userDeviceModel.create(newDevice);
        }
        // If device is not null, update refresh token
        else {
            const update = {
                refreshToken: tokens.refreshToken,
                deviceInfo: userAgent,
            };

            // If device status is INACTIVE, change status to ACTIVE
            if (device.deviceStatus === DeviceStatusEnum.INACTIVE) {
                update['deviceStatus'] = DeviceStatusEnum.ACTIVE;
            }

            await this.userDeviceModel.updateOne({_id: device._id}, update);

            // Find all device same user id and device type, then change status to INACTIVE, refreshToken to null
            await this.userDeviceModel.updateMany({
                userId: user._id,
                deviceType: dto.deviceType,
                _id: {$ne: device._id},
            }, {deviceStatus: DeviceStatusEnum.INACTIVE, refreshToken: null});
        }

        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            shouldActive: false,
        };
    }

    async revokeRefreshToken(userId: string, deviceId: string): Promise<void> {
        // Check if user exists
        const userExists = await this.userModel.exists({_id: userId}).exec();

        if (!userExists) {
            throw new NotFoundException('USER_NOT_FOUND');
        }

        // Check device
        const device = await this.userDeviceModel.findOne({userId: userId, deviceId: deviceId}).exec();
        if (!device)
            throw new NotFoundException('NOT_FOUND_DEVICE');

        // Remove refresh token
        await this.userDeviceModel.updateOne({_id: device._id}, {refreshToken: null});
    }

    /**
     * Forgot password
     * @param dto ForgotPasswordRequestDto
     */
    async forgotPassword(dto: ForgotPasswordRequestDto): Promise<void> {
        const user = await this.userModel.findOne({phoneNumber: dto.phoneNumber}).exec();
        if (!user) {
            throw new NotFoundException('USER_NOT_FOUND');
        }

        // create random otp 
        const otp = await this.authService.generateOtp();

        // TODO: send to email or sms for resetting password


        // Update otp in database
        await this.userModel.updateOne({_id: user._id}, {verifyAccountOtp: otp});

    }

    /**
     * Check user is forgotten password progress
     * @param {CheckInForgottenPasswordProgressRequestDto} dto
     * @return {boolean}
     * */
    async isInForgottenPasswordProgress(dto: CheckInForgottenPasswordProgressRequestDto): Promise<boolean> {
        // Check user is existed
        const user = await this.userModel.findOne({phoneNumber: dto.phoneNumber}).exec();
        if (!user)
            throw new NotFoundException('USER_NOT_FOUND');

        // Check user in progress
        return user.verifyAccountOtp !== null;
    }

    /**
     * Reset password
     * @param {ResetPasswordRequestDto} dto
     */
    async resetPassword(dto: ResetPasswordRequestDto): Promise<void> {
        // get user
        const user = await this.userModel.findOne({phoneNumber: dto.phoneNumber}).exec();
        // check user is existed
        if (!user) {
            throw new NotFoundException('USER_NOT_FOUND');
        }

        // TODO: Will verify if the application have send otp feature
        // // verify otp 
        // const verifyAccountOtp= (await user).verifyAccountOtp;
        // if(verifyAccountOtp !== dto.verifyAccountOtp){
        //   throw new BadRequestException("INVALID_OTP");
        // }
        // Hash new password
        const hashedPassword = await this.authService.hashData(dto.newPassword);

        // Update verifyAccountOtp

        await this.userModel.updateOne({_id: user._id}, {verifyAccountOtp: null});

        // Update password
        await this.userModel.updateOne({phoneNumber: dto.phoneNumber}, {password: hashedPassword}).exec();
    }

    /**
     * Verify OTP and return true if OTP is correct
     * @param {VerifyOptRequestDto} dto
     * @return {boolean}
     * */
    async verifyOtp(dto: VerifyOptRequestDto): Promise<boolean> {
        // Check if user exists
        const user = await this.userModel
            .findOne({phoneNumber: dto.phoneNumber})
            .exec();

        if (!user) {
            throw new NotFoundException('USER_NOT_FOUND');
        }

        // Check if OTP is correct
        if (user.verifyAccountOtp !== dto.otp) {
            throw new UnauthorizedException('INVALID_OTP');
        }

        return true;
    }

    /**
     * Check user active. if user exists and activeOtp is correct
     * @param {ActiveAccountRequestDto} dto
     * @return {ActiveAccountResponseDto}
     */
    async checkUserAndActiveOtp(
        dto: ActiveAccountRequestDto,
    ): Promise<ActiveAccountResponseDto> {
        // Check if user exists and activeOtp is correct
        const user = await this.userModel
            .findOne({email: dto.email, verifyAccountOtp: dto.otp})
            .exec();

        if (!user) {
            throw new BadRequestException('OTP_OR_EMAIL_INCORRECT');
        }

        // Update checkActiveUser field and return 
        // TODO: THis time will update checkActiveUser field but will update in the future about how to ensure user have checked active account

        return {
            ...dto,
            checkActiveUser: true,
        };
    }

    /**
     * Active account and change password
     * @param {ActiveAccountRequestDto} dto
     */
    async activeAccountAndChangePassword(
        dto: UpdateActiveAccountRequestDto,
    ): Promise<void> {
        // Check : Have user completed checkUserActive
        if (dto.checkActiveUser === null || dto.checkActiveUser === false)
            throw new BadRequestException();

        // Active account and update shouldChangePassword to true
        await this.userModel
            .updateOne(
                {email: dto.email.toLowerCase()},
                {verifiedAccount: true, verifyAccountOtp: null},
            )
            .exec();

        // Hash password
        const hashedPassword = await this.authService.hashData(dto.password);

        // Update password
        await this.userModel
            .updateOne({email: dto.email}, {password: hashedPassword})
            .exec();
    }

    /**
     * Resend OTP
     * @param {String} userEmail
     */
    async resendOtp(userEmail: string): Promise<void> {
        // Check if user exists
        const user = await this.userModel
            .findOne({email: userEmail.toLowerCase()})
            .exec();

        if (!user) {
            throw new NotFoundException('USER_NOT_FOUND');
        }

        // Generate OTP
        const otp = await this.authService.generateOtp();

        // Update active OTP
        await this.userModel
            .updateOne({email: user.email.toLowerCase()}, {activeOtp: otp})
            .exec();

        // Send OTP mail
        // await this.mailService.sendOtpMail(user.fullName, user.email, otp);
    }

    /**
     * Self delete user
     * @param {String} userId
     * */
    async selfDeleteUser(userId: string): Promise<void> {
        // Check if user exists
        const user = await this.userModel.findOne({_id: userId}).exec();

        if (!user) {
            throw new NotFoundException('USER_NOT_FOUND');
        }

        // Soft delete user
        user.softDelete();
    }

    async newAccessToken(dto: RefreshTokenRequest, deviceId: string): Promise<RefreshTokenResponse> {
        const dataFromAccessToken = await this.authService.getPrincipalFromExpiredAccessToken(dto.accessToken);
        const isRefreshTokenHasExpired = await this.authService.isRefreshTokenHasExpired(dto.refreshToken);

        if (isRefreshTokenHasExpired) {
            throw new UnauthorizedException('REFRESH_TOKEN_EXPIRED');
        }

        // Check if user exists
        const userExists = await this.userModel.exists({_id: dataFromAccessToken.sub}).exec();

        if (!userExists) {
            throw new NotFoundException('USER_NOT_FOUND');
        }

        // Check if device exists
        const device = await this.userDeviceModel.findOne({userId: dataFromAccessToken.sub, deviceId: deviceId}).exec();

        if (!device) {
            throw new NotFoundException('DEVICE_NOT_FOUND');
        }

        // Check if refresh token is correct
        if (device.refreshToken !== dto.refreshToken) {
            throw new UnauthorizedException('REFRESH_TOKEN_INCORRECT');
        }

        // Generate new access token
        const user = await this.userModel.findById(dataFromAccessToken.sub).populate('roles').exec();
        const roleIds = JSON.parse(JSON.stringify(user.roles))?.map(
            (role: RoleEntity) => role._id,
        );

        const payload: Payload = {
            email: user.email,
            sub: user._id,
            roles: roleIds,
        };

        const tokens = await this.authService.generateTokens(payload);

        // Update refresh token
        await this.userDeviceModel.updateOne({_id: device._id}, {refreshToken: tokens.refreshToken});

        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        };
    }
}
