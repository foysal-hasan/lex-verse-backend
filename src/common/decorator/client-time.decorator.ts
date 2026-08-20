import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ClientTime = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Date => {
    const request = ctx.switchToHttp().getRequest();
    return request.clientTime; // Guaranteed to be a valid Date object here
  },
);