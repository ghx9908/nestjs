import 'reflect-metadata'
export function Get(path: string = '') {
  return (target, propertyKey, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata('path', path, descriptor.value)
    Reflect.defineMetadata('method', 'GET', descriptor.value)
  }
}


export function Post(path: string = '') {
  return (target, propertyKey, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata('path', path, descriptor.value)
    Reflect.defineMetadata('method', 'Post', descriptor.value)
  }
}


export function Redirect(url: string = '/', statusCode: number = 302): MethodDecorator {
  return (target, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata('redirectUrl', url, descriptor.value);
    Reflect.defineMetadata('redirectStatusCode', statusCode, descriptor.value);
  };
}

export function HttpCode(statusCode: number): MethodDecorator {
  return (target, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata('httpCode', statusCode, descriptor.value);
  };
}

export function Header(name: string, value: string): MethodDecorator {
  return (target, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
    const existingHeaders = Reflect.getMetadata('headers', descriptor.value) || [];
    existingHeaders.push({ name, value });
    Reflect.defineMetadata('headers', existingHeaders, descriptor.value);
  };
}
