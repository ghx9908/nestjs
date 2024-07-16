

import { Module } from '@nestjs/common'
import { AppController } from './app.controller';
import { UserController } from './user.controller';
import { LoggerModule } from './logger/logger.module';
import { CoreModule } from './ core/core.module';
import { OtherModule } from './other/other.module';
import { CommonModule } from './common/common.module';
@Module({
  controllers: [AppController, UserController,],
  imports: [LoggerModule, CoreModule, OtherModule, CommonModule],
}
)
export class AppModule {
}
