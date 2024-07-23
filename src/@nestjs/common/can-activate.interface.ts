// 从当前目录下导入 ExecutionContext 接口
import { ExecutionContext } from './execution-context.interface';
// 定义 CanActivate 接口
export interface CanActivate {
  // 定义 canActivate 方法，接受一个 ExecutionContext 参数，返回 boolean 或 Promise<boolean>
  canActivate(context: ExecutionContext): boolean | Promise<boolean>;
}
1.2
