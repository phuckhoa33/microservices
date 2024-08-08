import {createParamDecorator, ExecutionContext} from '@nestjs/common';

export const GetXDeviceIdHeader = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.header('x-device-id');
    },
);