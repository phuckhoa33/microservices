import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
} from '@nestjs/websockets';
import {Server, Socket} from 'socket.io';
import {IRequestInitLoginByQrCode} from '../interfaces/request-init-login-by-qr-code.interface';
import {UserAuthQrService} from '../services/user-auth-qr.service';
import {LoggerService} from '../../../common/logger/services/logger.service';
import {Subscription} from 'rxjs';
import {OnApplicationShutdown} from '@nestjs/common';

@WebSocketGateway({
    cors: true,
    namespace: 'qr-code',
})
export class QrCodeGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, OnApplicationShutdown {
    private clients: Map<string, Socket> = new Map<string, Socket>();
    private eventSubscription: Subscription;

    constructor(
        private readonly userAuthQrService: UserAuthQrService,
        private readonly logger: LoggerService,
    ) {
    }

    onApplicationShutdown(signal?: string) {
        this.eventSubscription.unsubscribe(); // Unsubscribe from the event subscription
    }

    handleConnection(client: any, ...args: any[]) {
        this.logger.debug(`Client id: ${client.id} connected`, 'AppWebSocketGateway');
        this.clients.set(client.id, client);
    }

    handleDisconnect(client: Socket) {
        this.clients.delete(client.id); // Remove client from the Map when they disconnect
        client.emit('closed');
    }

    afterInit(server: Server) {
        this.eventSubscription = this.userAuthQrService.getEventSubject$().subscribe(({
            next: (event) => {
                event.callback(server, this.clients);
            },
            error: (error) => server.emit('ERR', error),
        }));
    }

    // Subscribe to the event 'init-login-by-qr-code'
    @SubscribeMessage('init-login-by-qr-code')
    async handleInitLoginByQrCode(client: Socket, data: IRequestInitLoginByQrCode): Promise<void> {
        await this.userAuthQrService.registerDeviceForQrLogin(client, data);
    }
}