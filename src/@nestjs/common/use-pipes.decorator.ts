import 'reflect-metadata';
import { PipeTransform } from './pipe-transform.interface';
export function UsePipes(...pipes: PipeTransform[]): MethodDecorator & ClassDecorator {
  return (target: object | Function, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<any>) => {
    if (descriptor) {
      Reflect.defineMetadata('pipes', pipes, descriptor.value);
    } else {
      Reflect.defineMetadata('pipes', pipes, target);
    }
  };
}
