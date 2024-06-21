import 'reflect-metadata'
export function Get(path: string = '') {
  return (target, propertyKey, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata('path', path, descriptor.value)
    Reflect.defineMetadata('method', 'GET', descriptor.value)
  }
}
