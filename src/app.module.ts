

import { Module } from '@nestjs/common'
import { AppController } from './app.controller';
import { UserController } from './user.controller';
import { LoggerModule } from './logger/logger.module';
import { CoreModule } from './ core/core.module';

@Module({
  controllers: [AppController, UserController],
  imports: [LoggerModule, CoreModule],
}
)
export class AppModule {
}
