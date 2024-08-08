import {Module} from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import * as admin from 'firebase-admin';
import {FIREBASE_APP} from './constants/firebase.contstant';

const firebaseProvider = {
    provide: FIREBASE_APP,
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
        const firebaseConfig = require('../../../firebase-config.json');
        return admin.initializeApp({
            credential: admin.credential.cert(firebaseConfig),
        });
    },
};

@Module({
    imports: [ConfigModule],
    // TODO: Uncomment this line to use the firebaseProvider
    // providers: [firebaseProvider],
    exports: [],
})
export class FirebaseModule {
}