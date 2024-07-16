import { Injectable } from '@nestjs/common';
@Injectable()
export class CommonService {
  log(message: string) {
    console.log('CommonService', message);
  }
}
