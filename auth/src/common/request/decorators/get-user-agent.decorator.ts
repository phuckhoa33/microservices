import {createParamDecorator, ExecutionContext} from '@nestjs/common';

export const GetUserAgentDecorator = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): string => {
        const request = ctx.switchToHttp().getRequest();
        return request.header('user-agent');
    },
);