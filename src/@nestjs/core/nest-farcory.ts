import { Logger } from "./logger";
import { NestApplication } from "./next-application"


export class NestFactory {


  static create(module) {
    Logger.log('Starting Nest application...', 'NestFactory');
    const app = new NestApplication(module)
    return app
  }
}
