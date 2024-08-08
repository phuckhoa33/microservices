import {Injectable, UnauthorizedException} from '@nestjs/common';
import {DeviceStatusEnum, DeviceTypeEnum} from '../constants/device.enum';
import {DatabaseModel} from '../../../common/database/decorators/database.decorator';
import {IUSerDeviceEntity, UserDeviceEntity} from '../entities/user-device.entity';
import {Model} from 'mongoose';
import {ApproveDeviceToLoginByQrRequestDto} from '../dtos/approve-device-to-login-by-qr.request.dto';
import {AuthService} from '../../../common/auth/services/auth.service';
import {InvestorEntity} from '../entities/investor.entity';
import {IRequestInitLoginByQrCode} from '../interfaces/request-init-login-by-qr-code.interface';
import {Server, Socket} from 'socket.io';
import {LoggerService} from '../../../common/logger/services/logger.service';
import {GetUserInfoFromLoginCodeResponseDto} from '../dtos/get-user-info-from-login-code.response.dto';
import {EventAbstractService} from '../../../app-gateway/abstracts/event.abstract.service';
import {RoleEntity} from '../../role/entities/role.entity';

@Injectable()
export class UserAuthQrService extends EventAbstractService {
    constructor(
        @DatabaseModel(UserDeviceEntity.name) private readonly userDeviceModel: Model<UserDeviceEntity>,
        @DatabaseModel(InvestorEntity.name) private readonly investorModel: Model<InvestorEntity>,
        private readonly authService: AuthService,
        private readonly logger: LoggerService,
    ) {
        super();
    }


    async registerDeviceForQrLogin(client: Socket, loginByQrCode: IRequestInitLoginByQrCode): Promise<void> {
        this.logger.debug(`Client id: ${client.id} emitted 'init-login-by-qr-code' with data: ${JSON.stringify(loginByQrCode)}`, 'QrCodeGateway');
        const loginCode = await this.generateLoginCode();
        const userDevice: IUSerDeviceEntity = {
            deviceId: loginByQrCode.deviceId,
            deviceType: DeviceTypeEnum.DESKTOP_BROWSER,
            deviceStatus: DeviceStatusEnum.WAITING_FOR_APPROVAL,
            browserName: loginByQrCode.browserName,
            osName: loginByQrCode.osName,
            loginCode: loginCode,
            socketId: client.id,
        };

        await this.userDeviceModel.create(userDevice);

        client.emit('login-code', loginCode);
    }

    private async generateLoginCode(): Promise<string> {
        // Random a 128-bit string
        return Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
    }

    // Approve device for QR login
    async approveDeviceForQrLogin(userId: string, dto: ApproveDeviceToLoginByQrRequestDto): Promise<void> {
        const userDevice = await this.userDeviceModel.findOne({loginCode: dto.loginCode}).exec();
        if (!userDevice) {
            throw new UnauthorizedException('INVALID_LOGIN_CODE_OR_DEVICE');
        }

        // Check if user device status not waiting for approval
        if (userDevice.deviceStatus !== DeviceStatusEnum.WAITING_FOR_APPROVAL) {
            throw new UnauthorizedException('DEVICE_NOT_WAITING_FOR_APPROVAL');
        }

        // Get user by userId
        const user = await this.investorModel.findById(userId).exec();

        const roleIds = JSON.parse(JSON.stringify(user.roles))?.map(
            (role: RoleEntity) => role._id,
        );

        // Generate tokens
        const payload = {
            email: user.email,
            sub: user.id,
            roles: roleIds,
        };

        const tokens = await this.authService.generateTokens(payload);

        // Inactive and remove refresh token of other devices with the same userId and deviceType (except the current device)
        await this.userDeviceModel.updateMany({
            userId: userId,
            deviceType: userDevice.deviceType,
            _id: {$ne: userDevice.id},
        }, {deviceStatus: DeviceStatusEnum.INACTIVE, refreshToken: null});

        // Emit event to the client
        this.addEvent((server: Server, clients: Map<string, Socket>): void => {
            const client = clients.get(userDevice.socketId);
            if (client) {
                client.emit('login-by-qr-tokens', tokens);
            }
        });

        // Update user device
        userDevice.deviceStatus = DeviceStatusEnum.ACTIVE;
        userDevice.userId = userId;
        userDevice.refreshToken = tokens.refreshToken;
        userDevice.loginCode = null;
        userDevice.socketId = null;

        await userDevice.save();
    }


    async getDeviceInfoFromLoginCode(
        dto: ApproveDeviceToLoginByQrRequestDto,
    ): Promise<GetUserInfoFromLoginCodeResponseDto> {
        const userDevice = await this.userDeviceModel.findOne({loginCode: dto.loginCode}).exec();

        if (!userDevice) {
            throw new UnauthorizedException('INVALID_LOGIN_CODE_OR_DEVICE');
        }

        return {
            browserName: userDevice.browserName,
            osName: userDevice.osName,
        };
    }
}