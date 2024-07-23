// 引入 reflect-metadata 库，提供元数据反射的能力
import 'reflect-metadata';
// 定义一个 Reflector 类
export class Reflector {
  // get 方法，用于获取元数据
  // T 是泛型，表示返回值的类型，可以是任意类型
  // metadataKey 是元数据的键
  // target 是目标对象，可以是类或类的原型
  // key 是可选参数，表示目标对象上的具体属性
  get<T extends any>(metadataKey: any, target: any, key?: string): T {
    // 如果传入了 key 参数，则获取 target 对象上 key 属性的元数据
    // 否则，获取 target 对象的元数据
    return key
      ? Reflect.getMetadata(metadataKey, target, key)  // 获取 target 对象上 key 属性的元数据
      : Reflect.getMetadata(metadataKey, target);      // 获取 target 对象的元数据
  }
}
