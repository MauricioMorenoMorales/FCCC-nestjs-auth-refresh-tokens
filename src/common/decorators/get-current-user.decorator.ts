import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

// Si hay un error fijarte en el tipo de express
export const GetCurrentUser = createParamDecorator(
  (data: string | undefined | any, context: ExecutionContext) => {
    const request: Request = context.switchToHttp().getRequest();
    if (!data) return request.user;
    return request.user[data];
  },
);
