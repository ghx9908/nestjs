

import { Get, Controller, Inject } from '@nestjs/common'
import { LoggerClassService, LoggerService, UseFactory, UseValueService } from './logger/logger.service'
import { CommonService } from './common/common.service'
import { OtherService } from './other/other.service'


@Controller()
export class AppController {
  constructor(
    private otherService: OtherService,
    private commonService: CommonService,
    private loggerService: LoggerService,
    private loggerClassService: LoggerClassService,
    @Inject('StringToken') private useValueServive: UseValueService,
    @Inject('FactoryToken') private usFeactoryToken: UseFactory,
  ) { }

  @Get()
  index() {
    this.otherService.log('index')
    return 'hello'
  }
  @Get("provider")
  provider() {
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
