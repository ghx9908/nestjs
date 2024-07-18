

import { Get, Controller, Inject, Req } from '@nestjs/common'
import { LoggerClassService, LoggerService, UseFactory, UseValueService } from './logger/logger.service'
import { CommonService } from './common/common.service'
import { OtherService } from './other/other.service'
import { AppService } from './app.service'


@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private otherService: OtherService,
    private commonService: CommonService,
    private loggerService: LoggerService,
    private loggerClassService: LoggerClassService,
    @Inject('StringToken') private useValueServive: UseValueService,
    @Inject('FactoryToken') private usFeactoryToken: UseFactory,
  ) { }


  @Get('middleware')
  middleware(@Req() req): string {
    return `middleware ${req.url}`;
  }
  @Get('abcde')
  abcde(): string {
    return `abcde`;
  }
  @Get('config')
  getConfig(): string {
    const config = this.appService.getConfig();
    return `Config Options: ${config}`;
  }

  @Get('module')
  module() {
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
