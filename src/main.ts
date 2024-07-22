import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

import { CustomExceptionFilter } from './custom-exception.filter';
// 导入 express-session 中间件，用于管理会话
import session from 'express-session';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ValidationPipe());
  // app.useGlobalFilters(new CustomExceptionFilter());
  // 使用 express-session 中间件来管理会话
  app.use(session({
    // 定义用于加密会话的密钥
    secret: 'your-secret-key',
    // 在每次请求结束时是否强制保存会话，即使它没有变化
    resave: false,
    // 是否在未初始化时保存会话
    saveUninitialized: false,
    // 定义会话的 cookie 配置
    cookie: {
      // 设置 cookie 的最大存活时间为一天（以毫秒为单位）
      maxAge: 1000 * 60 * 60 * 24,
    },
  }))
  await app.listen(3000)

}

bootstrap()
