import {Module} from '@nestjs/common';
import {UserAuthService} from './services/user-auth.service';
import {MongooseModule} from '@nestjs/mongoose';
import {PRIMARY_DATABASE_CONNECTION_NAME} from '../../common/database/constants/database-name.constant';
import {AuthModule} from '../../common/auth/auth.module';
import {RoleModule} from '../role/role.module';
import {UserProfile} from './profiles/user.profile';
import {InvestorEntity, InvestorSchema} from './entities/investor.entity';
import {MinioClientModule} from '../../common/minio-client/minio-client.module';
import {FavoriteEntity, FavoriteSchema} from './entities/favorite.entity';
import {UserDeviceEntity, UserDeviceSchema} from './entities/user-device.entity';
import {UserAuthQrService} from './services/user-auth-qr.service';
import {LoggerModule} from '../../common/logger/logger.module';
import {QrCodeGateway} from './gateway/qr-code.gateway';
import { WalletEntity, WalletSchema } from 'src/shared/entities/wallet.entity';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: InvestorEntity.name,
                schema: InvestorSchema,
            },
            {
                name: UserDeviceEntity.name,
                schema: UserDeviceSchema,
            },
            {
                name: FavoriteEntity.name,
                schema: FavoriteSchema,
            },
            {
                name: WalletEntity.name,
                schema: WalletSchema
            }
        ], PRIMARY_DATABASE_CONNECTION_NAME),
        AuthModule,
        RoleModule,
        MinioClientModule,
        LoggerModule,
    ],
    providers: [UserAuthService, UserProfile, UserAuthQrService, QrCodeGateway],
    exports: [UserAuthService, UserAuthQrService],
})

export class UserModule {
}