// 从 NestJS 的 common 包中导入 Injectable, CanActivate, ExecutionContext
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
// 从 NestJS 的 core 包中导入 Reflector
import { Reflector } from '@nestjs/core';
// 从 express 包中导入 Request
import { Request } from 'express';
// 使用 Injectable 装饰器标注 AuthGuard类，使其可以被注入到其他地方使用
@Injectable()
export class AuthGuard implements CanActivate {
  // 构造函数注入 Reflector
  constructor(private reflector: Reflector) { }
  // canActivate 方法用于决定是否允许某个请求通过
  canActivate(context: ExecutionContext): boolean {
    // 从处理程序的元数据中获取角色信息
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    // 如果没有角色信息，直接返回 true 允许通过
    if (!roles) {
      return true;
    }
    // 获取当前请求对象
    const request = context.switchToHttp().getRequest<Request>();
    // 从请求查询参数中获取用户角色
    const user = { roles: [request.query.role] };
    // 检查用户角色是否匹配所需角色
    return matchRoles(roles, user.roles);
  }
}
// matchRoles 函数用于检查用户角色是否匹配所需角色
function matchRoles(roles: string[], userRoles: string[]): boolean {
  // 如果用户的任何角色包含在所需角色中，则返回 true
  return userRoles.some(userRole => roles.includes(userRole));
}
