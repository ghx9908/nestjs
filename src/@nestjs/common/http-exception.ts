import { HttpStatus } from './http-status.enum';
export class HttpException extends Error {
  private readonly response: string | object;
  private readonly status: HttpStatus;

  constructor(response: string | object, status: HttpStatus) {
    console.log('response=>', response)
    super();
    this.response = response;
    this.status = status;
  }

  getResponse(): string | object {
    return this.response;
  }

  getStatus(): HttpStatus {
    return this.status;
  }
}
export class BadRequestException extends HttpException {
  constructor(message: string, error?: string) {
    console.log('message=>', message)
    super({ message, error, statusCode: HttpStatus.BAD_REQUEST }, HttpStatus.BAD_REQUEST);
  }
}
export class ForbiddenException extends HttpException {
  constructor(message: string = 'Forbidden', error: string = 'Forbidden') {
    super({ message, error, statusCode: HttpStatus.FORBIDDEN }, HttpStatus.FORBIDDEN);
  }
}
export class BadGatewayException extends HttpException {
  constructor() {
    super('Bad Gateway', HttpStatus.BAD_GATEWAY);
  }
}
export class RequestTimeoutException extends HttpException {
  constructor() {
    super('Request Timeout', HttpStatus.REQUEST_TIMEOUT);
  }
}
