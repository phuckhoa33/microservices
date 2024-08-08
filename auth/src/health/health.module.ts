import {Module} from '@nestjs/common';
import {TerminusModule} from '@nestjs/terminus';

@Module({
    providers: [],
    exports: [],
    imports: [TerminusModule],
})
export class HealthModule {
}
