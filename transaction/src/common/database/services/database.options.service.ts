import {Injectable} from '@nestjs/common';
import {MongooseModuleOptions} from '@nestjs/mongoose';
import mongoose from 'mongoose';
import {ConfigService} from '@nestjs/config';

@Injectable()
export class DatabaseOptionsService {
    constructor(private readonly configService: ConfigService) {
    }

    createOptions(tokenRegistered: string): MongooseModuleOptions {
        const host = this.configService.get<string>(`${tokenRegistered}.host`);
        const database =
            this.configService.get<string>(`${tokenRegistered}.name`) ?? undefined;
        const user = this.configService.get<string>(`${tokenRegistered}.user`);
        const password = this.configService.get<string>(`${tokenRegistered}.password`);
        const debug = this.configService.get<boolean>(`${tokenRegistered}.debug`);
        const options = this.configService.get<string>(`${tokenRegistered}.options`)
            ? `?${this.configService.get<string>(`${tokenRegistered}.options`)}`
            : '';

        mongoose.set('debug', debug);

        const uri = options ? `${host}/${options}` : host;

        const mongooseOptions: MongooseModuleOptions = {
            uri: uri,
            serverSelectionTimeoutMS: 5000,
            autoCreate: true,
        };

        if (database) {
            mongooseOptions.dbName = database;
        }

        if (user && password) {
            mongooseOptions.auth = {
                username: user,
                password: password,
            };
        }

        return mongooseOptions;
    }
}
