import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {MongooseModule} from '@nestjs/mongoose';
import {PRIMARY_DATABASE_CONNECTION_NAME} from './database/constants/database-name.constant';
import {DatabaseOptionsModule} from './database/database.options.module';
import {DatabaseOptionsService} from './database/services/database.options.service';
import {AuthModule} from './auth/auth.module';
import configs from '../configs';
import {RequestModule} from './request/request.module';
import {LoggerService} from './logger/services/logger.service';
import {LoggerModule} from './logger/logger.module';
import {MinioClientModule} from './minio-client/minio-client.module';
import {FirebaseModule} from './firebase/firebase.module';
import {PaginationModule} from './pagination/pagination.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: configs,
            cache: true,
            envFilePath: ['.env'],
            expandVariables: true,
        }),
        MongooseModule.forRootAsync({
            connectionName: PRIMARY_DATABASE_CONNECTION_NAME,
            imports: [DatabaseOptionsModule, LoggerModule],
            inject: [DatabaseOptionsService, LoggerService],
            useFactory: (databaseOptionsService: DatabaseOptionsService, logger: LoggerService) => ({
                ...databaseOptionsService.createOptions(PRIMARY_DATABASE_CONNECTION_NAME),
                connectionFactory: (connection) => {
                    if (connection.readyState === 1) {
                        logger.log(`Connection ${PRIMARY_DATABASE_CONNECTION_NAME} (${connection.host}:${connection.port}) established`, 'MongooseModule');
                    }

                    connection.on('reconnected', () => {
                        logger.log(`Connection ${PRIMARY_DATABASE_CONNECTION_NAME} (${connection.host}:${connection.port}) reconnected`, 'MongooseModule');
                    });

                    connection.on('disconnected', () => {
                        logger.log(`Connection ${PRIMARY_DATABASE_CONNECTION_NAME} (${connection.host}:${connection.port}) disconnected`, 'MongooseModule');
                    });
                    return connection;
                },
            }),
        }),
        AuthModule.forRoot(),
        RequestModule,
        MinioClientModule,
        FirebaseModule,
        PaginationModule,
    ],
    controllers: [],
    providers: [],
})
export class CommonModule {
}