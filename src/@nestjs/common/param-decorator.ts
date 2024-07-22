

import 'reflect-metadata'

export const createParamDecorator = (keyOrFactory: string | Function) => {
  return (attribute?: any, ...pipes: any[]) => {
    return (target, propertyKey, parameterIndex) => {
      const existingParameters = Reflect.getMetadata(`params:${String(propertyKey)}`, target, propertyKey) || [];
      if (keyOrFactory instanceof Function) {
        existingParameters[parameterIndex] = { index: parameterIndex, key: 'DecoratorFactory', factory: keyOrFactory, attribute, pipes };
      } else {
        existingParameters[parameterIndex] = { index: parameterIndex, key: keyOrFactory, attribute, pipes };
      }
      Reflect.defineMetadata(`params:${String(propertyKey)}`, existingParameters, target, propertyKey);
    }
  }
}



export const Req = createParamDecorator('Req')
export const Request = createParamDecorator('Request')
export const Res = createParamDecorator('Res')
export const Response = createParamDecorator('Response')
export const Query = createParamDecorator('Query')
export const Headers = (headerKey?: string) => createParamDecorator(`Headers`)(headerKey);
export const Session = createParamDecorator(`Session`)
export const Ip = createParamDecorator(`Ip`)
export const Param = createParamDecorator(`Param`)
export const Body = createParamDecorator(`Body`)
export const Next = createParamDecorator(`Next`)
