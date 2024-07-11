
import express, { Express, Request as ExpressRequest, Response as ExpressResponse, NextFunction } from 'express';
import { Logger } from './logger';
import path from 'path'
export class NestApplication {
  private readonly app: Express = express()
  private readonly module: any

  constructor(module: any) {
    this.module = module
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extened: true }))
  }


  use(middleware) {
    this.app.use(middleware)
  }
  async init() {

    const controllers = Reflect.getMetadata('controllers', this.module)
    // 记录日志：应用模块依赖已初始化
    Logger.log('AppModule dependencies initialized', 'InstanceLoader');

    for (let Controller of controllers) {
      const controller = new Controller();

      const prefix = Reflect.getMetadata('prefix', Controller) || '/'
      const controllerPrototype = Reflect.getPrototypeOf(controller)
      Logger.log(`${Controller.name} {${prefix}}:`, 'RoutesResolver');

      for (let methodName of Object.getOwnPropertyNames(controllerPrototype)) {
        const method = controller[methodName]
        const pathMetadata = Reflect.getMetadata('path', method)
        const httpMethod = Reflect.getMetadata('method', method)
        const redirectUrl = Reflect.getMetadata('redirectUrl', method);
        const redirectStatusCode = Reflect.getMetadata('redirectStatusCode', method);
        const httpCode = Reflect.getMetadata('httpCode', method);
        const headers = Reflect.getMetadata('headers', method) || [];

        if (httpMethod) {
          const routePath = path.posix.join('/', prefix, pathMetadata)
          this.app[httpMethod.toLowerCase()](routePath, async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {

            // 解析方法参数
            const args = this.resolveParams(controller, methodName, req, res, next);

            const result = await method.call(controller, ...args)

            if (result && result.url) {
              res.redirect(result.statusCode || 302, result.url);
              return;
            }
            if (redirectUrl) {
              res.redirect(redirectStatusCode || 302, redirectUrl);
              return;
            }
            if (httpCode) {
              res.status(httpCode);
            } else if (httpMethod === 'POST') {
              res.status(201);
            }

            const responseMeta = this.getResponseMetadata(controller, methodName);
            if (!responseMeta || (responseMeta.attribute?.passthrough)) {
              headers.forEach((header: { name: string; value: string }) => {
                res.setHeader(header.name, header.value);
              });

              return res.send(result);
            }

          })
          // 记录日志：映射路由路径和 HTTP 方法
          Logger.log(`Mapped {${routePath}, ${httpMethod}} route`, 'RouterExplorer');
        }
      }
    }
  }

  private getResponseMetadata(instance: any, methodName: string): any {
    const paramsMetadata = Reflect.getMetadata(`params:${methodName}`, instance, methodName) || [];
    return paramsMetadata.filter(Boolean).find((param: any) => param.key === 'Res' || param.key === 'Response' || param.key === 'Next');
  }
  private resolveParams(instance, methodName, req, res, next) {
    const paramsMetadata = Reflect.getMetadata(`params:${methodName}`, instance, methodName) || [];
    return paramsMetadata.map((param) => {
      const { key, attribute } = param;
      const ctx = {
        switchToHttp: () => ({
          getRequest: () => req,
          getResponse: () => res,
          getNext: () => next,
        }),
      }
      switch (key) {
        case 'Request':
        case 'Req':
          return req;
        case 'Query':
          return attribute ? req.query[attribute] : req.query;
        case 'Headers':
          return attribute ? req.headers[attribute] : req.headers;
        case 'Session':
          return req.session;
        case 'Ip':
          return req.ip;
        case 'Param':
          return attribute ? req.params[attribute] : req.params;
        case 'Body':
          return attribute ? req.body[attribute] : req.body;
        case 'Response':
        case 'Res':
          return res;
        case 'Next':
          return next;
        case 'DecoratorFactory':
          return param.factory(attribute, ctx);
        default:
          return null;
      }
    })
  }
  async listen(port: number) {
    await this.init()
    this.app.listen(port, () => {
      Logger.log(`Application is running on: http://localhost:${port}`, 'NestApplication');
    })
  }
}
