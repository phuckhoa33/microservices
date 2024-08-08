import {Controller, Get, VERSION_NEUTRAL} from '@nestjs/common';
import {ApiTags} from '@nestjs/swagger';
import {
    DiskHealthIndicator,
    HealthCheck,
    HealthCheckService,
    MemoryHealthIndicator,
    MongooseHealthIndicator,
} from '@nestjs/terminus';
import {Connection} from 'mongoose';
import {DatabaseConnection} from '../../common/database/decorators/database.decorator';

@ApiTags('health')
@Controller({
    version: VERSION_NEUTRAL,
    path: '/health',
})
export class HealthController {
    constructor(
        @DatabaseConnection() private readonly databaseConnection: Connection,
        private readonly health: HealthCheckService,
        private readonly memoryHealthIndicator: MemoryHealthIndicator,
        private readonly diskHealthIndicator: DiskHealthIndicator,
        private readonly mongooseIndicator: MongooseHealthIndicator,
    ) {
    }

    @HealthCheck()
    @Get('/database')
    async checkDatabase() {
        const data = await this.health.check([
            () =>
                this.mongooseIndicator.pingCheck('database', {
                    connection: this.databaseConnection,
                }),
        ]);

        return {
            data,
        };
    }

    @HealthCheck()
    @Get('/memory-heap')
    async checkMemoryHeap() {
        const data = await this.health.check([
            () =>
                this.memoryHealthIndicator.checkHeap(
                    'memoryHeap',
                    300 * 1024 * 1024,
                ),
        ]);

        return {
            data,
        };
    }

    @HealthCheck()
    @Get('/memory-rss')
    async checkMemoryRss() {
        const data = await this.health.check([
            () =>
                this.memoryHealthIndicator.checkRSS(
                    'memoryRss',
                    300 * 1024 * 1024,
                ),
        ]);

        return {
            data,
        };
    }

    @HealthCheck()
    @Get('/storage')
    async checkStorage() {
        // Check if Windows
        const isWindows = process.platform === 'win32';

        const data = await this.health.check([
            () =>
                this.diskHealthIndicator.checkStorage('diskHealth', {
                    thresholdPercent: 0.6,
                    path: isWindows ? 'C:' : '/',
                }),
        ]);

        return {
            data,
        };
    }
}
