// 引入反射元数据的库
import 'reflect-metadata';
// 定义一个装饰器函数 SetMetadata，接受两个参数：metadataKey 和 metadataValue
export function SetMetadata(metadataKey: any, metadataValue: any): MethodDecorator & ClassDecorator {
  // 返回一个装饰器函数
  return (target: object | Function, key?: string | symbol, descriptor?: TypedPropertyDescriptor<any>) => {
    // 如果 descriptor 存在，则表示这是一个方法装饰器
    if (descriptor) {
      // 将元数据附加到方法上
      Reflect.defineMetadata(metadataKey, metadataValue, descriptor.value);
    } else {
      // 否则，将元数据附加到类上
      Reflect.defineMetadata(metadataKey, metadataValue, target);
    }
  };
}
