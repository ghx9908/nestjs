import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import { AppController } from './app.controller';
import { UserController } from './user.controller';
import { LoggerModule } from './logger/logger.module';
import { CoreModule } from './ core/core.module';
import { OtherModule } from './other/other.module';
import { CommonModule } from './common/common.module';
import { AppService } from './app.service';
import { DynamicConfigModule } from './dynamicConfig.module';
import { LoggerMiddleware } from './logger.middleware';
@Module({
  controllers: [AppController, UserController,],
  imports: [LoggerModule, CoreModule, OtherModule, CommonModule, DynamicConfigModule.forRoot({ apiKey: '456' })],
  providers: [AppService]
}
)
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: 'middleware', method: RequestMethod.GET });

  }
}
