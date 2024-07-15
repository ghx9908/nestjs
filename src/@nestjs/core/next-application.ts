
import express, { Express, Request as ExpressRequest, Response as ExpressResponse, NextFunction } from 'express';
import { Logger } from './logger';
import path from 'path'
import { DESIGN_PARAMTYPES, INJECTED_TOKENS } from '@nestjs/common/constants';
export class NestApplication {
  private readonly app: Express = express()
  private readonly module: any
  private readonly providers = new Map()

  constructor(module: any) {
    this.module = module
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extened: true }))
    this.initProviders();
  }

  // 初始化提供者
  private initProviders() {
    // 获取当前模块的提供者元数据
    const providers = Reflect.getMetadata('providers', this.module) || [];
    // 遍历并添加每个提供者
    for (const provider of providers) {
      this.addProvider(provider);
    }
  }

  // 添加提供者
  addProvider(provider) {
    // 如果提供者有provide和useClass属性
    if (provider.provide && provider.useClass) {
      // 解析依赖项
      const dependencies = this.resolveDependencies(provider.useClass);
      // 创建类实例
      const classInstance = new provider.useClass(...dependencies);
      // 将提供者添加到Map中
      this.providers.set(provider.provide, classInstance);
    } else if (provider.provide && provider.useValue) { // 如果提供者有provide和useValue属性
      // 直接将值添加到Map中
      this.providers.set(provider.provide, provider.useValue);
    } else if (provider.provide && provider.useFactory) { // 如果提供者有provide和useFactory属性
      const inject = provider.inject ?? [];
      const injectedValues = inject.map(this.getProviderByToken);
      const value = provider.useFactory(...injectedValues);
      this.providers.set(provider.provide, value);
    } else { // 直接是类
      const dependencies = this.resolveDependencies(provider);
      this.providers.set(provider, new provider(...dependencies));
    }
  }


  use(middleware) {
    this.app.use(middleware)
  }

  private getProviderByToken = (injectedToken) => {
    return this.providers.get(injectedToken) ?? injectedToken;
  }
  resolveDependencies(Controller) {
    const injectedTokens = Reflect.getMetadata(INJECTED_TOKENS, Controller) ?? []
    const constructorParams = Reflect.getMetadata(DESIGN_PARAMTYPES, Controller) ?? []
    return constructorParams.map((param, index) => {
      return this.getProviderByToken(injectedTokens[index] ?? param);
    })

  }
  async init() {

    const controllers = Reflect.getMetadata('controllers', this.module)
    // 记录日志：应用模块依赖已初始化
    Logger.log('AppModule dependencies initialized', 'InstanceLoader');

    for (let Controller of controllers) {
      const dependencies = this.resolveDependencies(Controller)

      const controller = new Controller(...dependencies);

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
