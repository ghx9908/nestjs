

import { Get, Controller, Inject, Req, HttpStatus, HttpException, ForbiddenException, BadRequestException, UseFilters } from '@nestjs/common'
import { LoggerClassService, LoggerService, UseFactory, UseValueService } from './logger/logger.service'
import { CommonService } from './common/common.service'
import { OtherService } from './other/other.service'
import { AppService } from './app.service'
import { CustomExceptionFilter } from './custom-exception.filter';

@UseFilters(new CustomExceptionFilter())
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


  @Get('exception')
  exception() {
    // throw new Error('exception');
    // throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    throw new HttpException({
      status: HttpStatus.FORBIDDEN,
      error: 'This is a custom message',
    }, HttpStatus.FORBIDDEN);
  }
  @UseFilters(new CustomExceptionFilter())
  @Get('custom')
  custom() {
    throw new ForbiddenException();
  }
  @Get('bad-request')
  badRequest() {
    throw new BadRequestException('Something bad happened', 'Some error description');
  }

  @Get('middleware')
  middleware(@Req() req): string {
    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
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
