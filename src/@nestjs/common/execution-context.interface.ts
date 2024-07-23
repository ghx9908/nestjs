
// 从 './arguments-host.interface' 导入 ArgumentsHost 接口
import { ArgumentsHost } from './arguments-host.interface';
// 定义一个名为 ExecutionContext 的接口，它继承自 ArgumentsHost 接口
export interface ExecutionContext extends ArgumentsHost {
  // 定义一个方法 getClass，用于获取类
  // 该方法返回类型为泛型 T，默认类型为 any
  getClass<T = any>(): T;
  // 定义一个方法 getHandler，用于获取处理函数
  // 该方法返回类型为 Function
  getHandler(): Function;
}
