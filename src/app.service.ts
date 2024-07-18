import { Inject, Injectable } from '@nestjs/common';
@Injectable()
export class AppService {
  constructor(
    @Inject('PREFIX') private readonly prefix: any,
    @Inject('CONFIG') private readonly config: any,
  ) { }

  getConfig() {
    return this.prefix + this.config.apiKey;
  }
}
