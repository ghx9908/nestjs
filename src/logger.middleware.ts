import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AppService } from './app.service';
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private appService: AppService) { }
  use(req: Request, res: Response, next: NextFunction) {
    console.log('LoggerMiddleware', this.appService.getConfig());
    next();
  }
}
