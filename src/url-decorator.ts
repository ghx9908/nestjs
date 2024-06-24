import { createParamDecorator } from '@nestjs/common';
export const UrlDecorator = createParamDecorator(
  (attribute, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request[attribute];
  },
)
