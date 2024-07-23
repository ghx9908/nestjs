// 导入 Controller, Get, UseGuards 装饰器
import { Controller, Get, UseGuards } from "@nestjs/common";
// 导入自定义的 RolesGuard
import { AuthGuard } from "./auth.guard";
// 导入自定义的 Roles 装饰器
import { Roles } from "./roles.decorator";
// 使用 @Controller 装饰器定义一个控制器，路由前缀为 'accounts'
@Controller('accounts')
export class AccountController {
  // 定义一个 GET 请求的处理方法
  @Get()
  // 使用 @UseGuards 装饰器来应用 AuthGuard守卫
  @UseGuards(AuthGuard)
  // 使用 @Roles 装饰器来限制只有具有 'admin' 角色的用户才能访问此方法
  @Roles('admin')
  // 异步方法，处理 GET 请求并返回一个字符串
  async index() {
    return 'This action returns all accounts';
  }
}
