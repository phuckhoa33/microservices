import PrimaryDatabaseConfig from './primary-database.config';
import AuthConfig from './auth.config';
import FirebaseConfig from './firebase.config';
import MinioClientConfig from './minio-client.config';
import AppConfig from './app.config';
import MiddlewareConfig from './middleware.config';

export default [
    AppConfig,
    PrimaryDatabaseConfig,
    AuthConfig,
    MiddlewareConfig,
    MinioClientConfig,
    FirebaseConfig,
    AppConfig,
];