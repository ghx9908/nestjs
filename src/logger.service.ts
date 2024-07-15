
import { Inject, Injectable } from '@nestjs/common'

@Injectable()
export class LoggerClassService {
  log(message: string) {
    console.log(message, 'LoggerClassService');
  }
}

@Injectable()
export class LoggerService {
  constructor(@Inject('SUFFIX') private suffix: string) {

  }
  log(message: string) {
    console.log(message, this.suffix, 'LoggerService');
  }
}


@Injectable()
export class UseValueServive {
  constructor(private prifix: string) {

  }
  log(message: string) {
    console.log(message, this.prifix, 'UseValueServive');
  }
}

@Injectable()
export class UseFactory {
  constructor(private prifix1, private prifix2) {

  }
  log(message: string) {
    console.log(message, this.prifix1, this.prifix2, 'UseFactory');
  }
}
