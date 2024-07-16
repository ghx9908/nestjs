import { CommonService } from './../common/common.service';
import { Injectable } from '@nestjs/common';
@Injectable()
export class OtherService {


  constructor(private commonService: CommonService) {

  }
  log(message: string) {
    this.commonService.log(" commonService");
    console.log('OtherService', message);
  }
}
