import { Module } from '@nestjs/common';
import { LoggerClassService, LoggerService, UseValueService, UseFactory } from './logger.service';
@Module({
  providers: [
    {
      provide: 'SUFFIX',
      useValue: 'suffix'
    },
    LoggerClassService,
    {
      provide: LoggerService,
      useClass: LoggerService
    },
    {
      provide: 'StringToken',
      useValue: new UseValueService('prefix')
    },
    {
      provide: 'FactoryToken',

      useFactory: () => new UseFactory('prifix1', 'prifix2')
    }
  ],
  exports: [LoggerService, 'StringToken', 'FactoryToken', 'SUFFIX', LoggerClassService]
})
export class LoggerModule { }
