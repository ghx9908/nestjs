

import { Module } from '@nestjs/common'
import { AppController } from './app.controller';
import { UserController } from './user.controller';
import { LoggerService, UseValueServive, UseFactory, LoggerClassService } from './logger.service';


@Module({
  controllers: [AppController, UserController],
  providers: [
    {
      provide: "SUFFIX",
      useValue: 'suffix'
    },
    LoggerClassService,
    {
      provide: LoggerService,
      useClass: LoggerService,
    },
    {
      provide: "StringToken",
      useValue: new UseValueServive('prifix'),
    },

    {
      provide: 'FactoryToken',
      inject: ['prefix1', 'SUFFIX'],
      useFactory: (prefix1, suffix) => new UseFactory(prefix1, suffix)
    }
  ],
}
)
export class AppModule {
}
