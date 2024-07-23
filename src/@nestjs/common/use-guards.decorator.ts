// 导入reflect-metadata，用于反射API的元数据
import 'reflect-metadata';
// 导入CanActivate接口
import { CanActivate } from './can-activate.interface';
// 定义一个装饰器函数UseGuards，可以作为方法和类的装饰器
export function UseGuards(...guards: (CanActivate | Function)[]): MethodDecorator & ClassDecorator {
  // 返回一个装饰器函数，接收目标对象、属性键和描述符作为参数
  return (target: object | Function, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<any>) => {
    // 如果有描述符，表示装饰的是方法
    if (descriptor) {
      // 将guards元数据定义在方法上
      Reflect.defineMetadata('guards', guards, descriptor.value);
    } else {
      // 如果没有描述符，表示装饰的是类，将guards元数据定义在类上
      Reflect.defineMetadata('guards', guards, target);
    }
  };
}
