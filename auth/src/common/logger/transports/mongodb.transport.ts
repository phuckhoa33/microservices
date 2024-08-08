import * as winston from 'winston';
import * as winstonMongoDB from 'winston-mongodb';
import * as process from 'process';

export class MongoDBTransport {
    getInstance() {
        return new winstonMongoDB.MongoDB({
            level: 'error',
            db: process.env.LOGGER_DATABASE_URL,
            options: {
                useUnifiedTopology: true,
            },
            dbName: process.env.LOGGER_DATABASE_NAME,
            collection: process.env.LOGGER_DATABASE_COLLECTION,
            leaveConnectionOpen: false,
            metaKey: 'meta',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json(),
            ),
        });
    }
}