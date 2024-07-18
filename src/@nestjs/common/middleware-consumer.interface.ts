import { RequestMethod } from './request-method.enum';
export interface MiddlewareConsumer {
  apply(...middleware: (Function | any)[]): this;
  forRoutes(...routes: (string | { path: string; method: RequestMethod } | Function)[]): this;
}
