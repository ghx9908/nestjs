import 'reflect-metadata';
import { ExceptionFilter } from './exception-filter.interface';
export function UseFilters(...filters: ExceptionFilter[]): ClassDecorator & MethodDecorator {
  return (target: object | Function, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<any>) => {
    if (descriptor) {
      Reflect.defineMetadata('filters', filters, descriptor.value);
    } else {
      Reflect.defineMetadata('filters', filters, target);
    }
  };
}
