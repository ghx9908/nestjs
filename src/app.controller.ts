

import { Get, Controller, Inject } from '@nestjs/common'
import { LoggerClassService, LoggerService, UseFactory, UseValueServive } from './logger.service'


@Controller()
export class AppController {
  constructor(
    private loggerService: LoggerService,
    private loggerClassService: LoggerClassService,
    @Inject('StringToken') private useValueServive: UseValueServive,
    @Inject('FactoryToken') private usFeactoryToken: UseFactory,
  ) { }
  @Get()
  index() {
    this.loggerClassService.log('index')
    this.loggerService.log('index')
    this.useValueServive.log('index')
    this.usFeactoryToken.log('index')
    return 'hello'
  }


  @Get('info')
  info() {
    return 'info'
  }

}
