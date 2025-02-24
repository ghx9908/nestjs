
import express, { Express, Request as ExpressRequest, Response as ExpressResponse, NextFunction } from 'express';
import { Logger } from './logger';
import path from 'path'
import { RequestMethod, defineModule, GlobalHttpExceptionFilter, PARAMTYPES_METADATA, ArgumentsHost, ExecutionContext, CanActivate, ForbiddenException, FORBIDDEN_MESSAGE } from '../common';
import { ExceptionFilter } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
export class NestApplication {
  private readonly app: Express = express()
  private readonly module: any
  private readonly providerInstances = new Map();// 所有的privater的实例
  private readonly globalProviders = new Set();//全局的privader
  private readonly moduleProviders = new Map(); //模块对应的private token
  private readonly middlewares = []
  private readonly excludedRoutes = []
  private readonly globalPipes = [];
  private readonly defaultGlobalHttpExceptionFilter = new GlobalHttpExceptionFilter()
  private readonly globalHttpExceptionFilters: ExceptionFilter[] = [];
  constructor(module: any) {
    this.module = module
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extened: true }))

  }

  private initMiddlewares() {
    this.module.prototype.configure?.(this);
  }
  apply(...middleware: (Function | any)[]): this {
    this.middlewares.push(...middleware);
    return this;
  }

  private isExcluded(reqPath: string, method: RequestMethod): boolean {
    return this.excludedRoutes.some(route => {
      const { routePath, routeMethod } = this.normalizeRouteInfo(route);
      return routePath === reqPath && (routeMethod === RequestMethod.ALL || routeMethod === method);
    });
  }
  forRoutes(...routes: any[]): this {
    for (const route of routes) {
      for (const middleware of this.middlewares) {
        const { routePath, routeMethod } = this.normalizeRouteInfo(route);
        this.app.use(routePath, (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
          if (this.isExcluded(req.originalUrl, req.method)) {
            return next();
          }
          if ((routeMethod === RequestMethod.ALL || routeMethod === req.method)) {
            if (typeof middleware === 'function' && middleware.prototype && 'use' in middleware.prototype) {
              defineModule(this.module, middleware);
              const dependencies = this.resolveDependencies(middleware);
              const middlewareInstance = new middleware(...dependencies);
              middlewareInstance.use(req, res, next);
            } else if (typeof middleware === 'function') {
              middleware(req, res, next);
            } else {

              next();
            }
          } else {
            next();
          }
        });
      }
    }
    this.middlewares.length = 0;
    return this;
  }
  exclude(...routes: any[]): this {
    this.excludedRoutes.push(...routes);
    return this;
  }
  private normalizeRouteInfo(route) {
    let routePath = '';
    let routeMethod = RequestMethod.ALL;
    if (typeof route === 'string') {
      routePath = route;
    } else if ('path' in route) {
      routePath = route.path;
      routeMethod = route.method ?? RequestMethod.ALL;
    }
    else if (route instanceof Function) {
      routePath = Reflect.getMetadata('prefix', route) || '';
    }
    routePath = path.posix.join('/', routePath);
    return { routePath, routeMethod };
  }

  private addCoreProviders() {
    this.addProvider(Reflector, this.module, true);
  }

  // 初始化提供者
  private initProviders() {
    this.addCoreProviders();
    // 获取模块的导入元数据
    const imports = Reflect.getMetadata('imports', this.module) || [];

    // 遍历所有导入的模块
    for (const importModule of imports) {
      if (importModule.module) {
        const { module, providers, exports, controllers } = importModule;
        const oldProvide = Reflect.getMetadata('providers', module) ?? [];;
        const oldControllers = Reflect.getMetadata('controllers', module) ?? [];
        const oldImports = Reflect.getMetadata('imports', module) ?? [];
        const oldExports = Reflect.getMetadata('exports', module) ?? [];
        defineModule(this.module, providers);
        defineModule(this.module, controllers);
        Reflect.defineMetadata('controllers', [...oldControllers, ...controllers ?? []], module);
        Reflect.defineMetadata('providers', [...oldProvide, ...providers ?? []], module);
        Reflect.defineMetadata('imports', [...oldImports, ...imports ?? []], module);
        Reflect.defineMetadata('exports', [...oldExports, ...exports ?? []], module);
        this.registerProvidersFromModule(module, this.module);
      } else {
        this.registerProvidersFromModule(importModule, this.module);
      }
    }
    // 获取当前模块的提供者元数据
    const providers = Reflect.getMetadata('providers', this.module) || [];
    // 遍历并添加每个提供者
    for (const provider of providers) {
      this.addProvider(provider, this.module);
    }
  }

  private registerProvidersFromModule(module, ...parentModules) {
    const global = Reflect.getMetadata('global', module);
    const providers = Reflect.getMetadata('providers', module) || [];
    const exports = Reflect.getMetadata('exports', module) || [];
    for (const exportToken of exports) {
      if (this.isModule(exportToken)) {
        this.registerProvidersFromModule(exportToken, module, ...parentModules)
      } else {
        const provider = providers.find(provider => provider === exportToken || provider.provide === exportToken);
        if (provider) {
          [module, ...parentModules].forEach(module => {
            this.addProvider(provider, module, global);
          });
        }
      }
    }
    this.initController(module);
  }
  isModule(injectToken) {
    return injectToken && injectToken instanceof Function && Reflect.getMetadata('isModule', injectToken)
  }
  // 添加提供者
  addProvider(provider, module, global = false) {
    const providers = global ? this.globalProviders : (this.moduleProviders.get(module) || new Set());
    if (!global && !this.moduleProviders.has(module)) {
      this.moduleProviders.set(module, providers);
    }

    // 如果提供者有provide和useClass属性
    if (provider.provide && provider.useClass) {
      const injectToken = provider.provide || provider;
      // 解析依赖项
      const dependencies = this.resolveDependencies(provider.useClass);
      // 创建类实例
      const classInstance = new provider.useClass(...dependencies);
      // 将提供者添加到Map中
      this.providerInstances.set(injectToken, classInstance);
      providers.add(injectToken);
    } else if (provider.provide && provider.useValue) { // 如果提供者有provide和useValue属性
      // 直接将值添加到Map中
      this.providerInstances.set(provider.provide, provider.useValue);
      providers.add(provider.provide);
    } else if (provider.provide && provider.useFactory) { // 如果提供者有provide和useFactory属性
      const inject = provider.inject ?? [];
      const injectedValues = inject.map((inject) => this.getProviderByToken(inject, module));
      const value = provider.useFactory(...injectedValues);
      this.providerInstances.set(provider.provide, value);
      providers.add(provider.provide);
    } else { // 直接是类
      const dependencies = this.resolveDependencies(provider);
      const classInstance = new provider(...dependencies);
      this.providerInstances.set(provider, classInstance);
      providers.add(provider);
    }
  }


  use(middleware) {
    this.app.use(middleware)
  }

  private getProviderByToken(injectedToken: any, module: any) {
    if (this.globalProviders.has(injectedToken)) {
      return this.providerInstances.get(injectedToken);
    } else if (this.moduleProviders.get(module)?.has(injectedToken)) {
      return this.providerInstances.get(injectedToken);
    }
  }
  resolveDependencies(Clazz) {
    const injectedTokens = Reflect.getMetadata('injectedTokens', Clazz) ?? []
    const constructorParams = Reflect.getMetadata(PARAMTYPES_METADATA, Clazz) ?? []
    return constructorParams.map((param, index) => {
      const module = Reflect.getMetadata('module', Clazz);
      const injectedToken = injectedTokens[index] ?? param;
      return this.getProviderByToken(injectedToken, module);
    })

  }
  private getGuardInstance(guard: CanActivate | Function): CanActivate {
    if (typeof guard === 'function') {
      const dependencies = this.resolveDependencies(guard);
      return new (guard as any)(...dependencies);
    }
    return guard as CanActivate;
  }
  private async callGuards(guards: CanActivate[], context: ExecutionContext) {
    for (const guard of guards) {
      const guardInstance = this.getGuardInstance(guard);
      const canActivate = await guardInstance.canActivate(context);
      if (!canActivate) {
        throw new ForbiddenException(FORBIDDEN_MESSAGE);
      }
    }
  }
  async initController(module) {
    const controllers = Reflect.getMetadata('controllers', module) || [];
    // 记录日志：应用模块依赖已初始化
    Logger.log('AppModule dependencies initialized', 'InstanceLoader');

    for (let Controller of controllers) {
      const dependencies = this.resolveDependencies(Controller)
      const controller = new Controller(...dependencies);
      const prefix = Reflect.getMetadata('prefix', Controller) || '/'
      const controllerPrototype = Reflect.getPrototypeOf(controller)
      Logger.log(`${Controller.name} {${prefix}}:`, 'RoutesResolver');
      const controllerFilters = Reflect.getMetadata('filters', Controller) || [];
      const controllerPipes = Reflect.getMetadata('pipes', Controller) || [];
      const controllerGuards = Reflect.getMetadata('guards', Controller) || [];
      for (let methodName of Object.getOwnPropertyNames(controllerPrototype)) {
        const method = controller[methodName]
        const pathMetadata = Reflect.getMetadata('path', method)
        const httpMethod = Reflect.getMetadata('method', method)
        const redirectUrl = Reflect.getMetadata('redirectUrl', method);
        const redirectStatusCode = Reflect.getMetadata('redirectStatusCode', method);
        const httpCode = Reflect.getMetadata('httpCode', method);
        const headers = Reflect.getMetadata('headers', method) || [];
        const methodFilters = Reflect.getMetadata('filters', method) || [];
        const methodPipes = Reflect.getMetadata('pipes', method) || [];
        const methodGuards = Reflect.getMetadata('guards', method) || [];
        const guards = [...controllerGuards, ...methodGuards];
        const pipes = [...controllerPipes, ...methodPipes];
        if (httpMethod) {
          const routePath = path.posix.join('/', prefix, pathMetadata)
          const filters = [...controllerFilters, ...methodFilters];
          this.app[httpMethod.toLowerCase()](routePath, async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
            const host: ArgumentsHost = {
              switchToHttp: () => ({
                getRequest: () => req,
                getResponse: () => res,
                getNext: () => next,
              }),
            };
            const context: ExecutionContext = {
              ...host,
              getClass: () => Controller,
              getHandler: () => method,
            }
            try {
              await this.callGuards(guards, context);
              // 解析方法参数
              const args = await Promise.all(this.resolveParams(controller, methodName, req, res, next, host, pipes))

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
            } catch (error) {
              await this.callExceptionFilters(error, host, filters);
            }
          })
          // 记录日志：映射路由路径和 HTTP 方法
          Logger.log(`Mapped {${routePath}, ${httpMethod}} route`, 'RouterExplorer');
        }
      }
    }
  }

  useGlobalFilters(...filters: ExceptionFilter[]): void {
    this.globalHttpExceptionFilters.push(...filters);
  }
  getFilterInstance(filter) {
    if (filter instanceof Function) {
      const dependencies = this.resolveDependencies(filter);
      console.log('dependencies', dependencies);
      return new filter(...dependencies);
    }
    return filter;
  }
  private async callExceptionFilters(error: any, host: ArgumentsHost, filters: ExceptionFilter[] = []) {
    const allFilters = [...filters, ...this.globalHttpExceptionFilters, this.defaultGlobalHttpExceptionFilter];
    for (const filter of allFilters) {
      let filterInstance = this.getFilterInstance(filter);
      const exceptions = Reflect.getMetadata('catch', filterInstance.constructor) || [];
      if (exceptions.length == 0 || exceptions.some((exception: any) => error instanceof exception)) {
        console.log('filter=>', filter)
        filterInstance.catch(error, host);
        break;
      }
    }
  }

  private getResponseMetadata(instance: any, methodName: string): any {
    const paramsMetadata = Reflect.getMetadata(`params:${methodName}`, instance, methodName) || [];
    return paramsMetadata.filter(Boolean).find((param: any) => param.key === 'Res' || param.key === 'Response' || param.key === 'Next');
  }
  private resolveParams(instance, methodName, req, res, next, host, pipes) {
    const paramsMetadata = Reflect.getMetadata(`params:${methodName}`, instance, methodName) || [];
    return paramsMetadata.map(async (param) => {
      const { key, attribute, pipes: paramPipes, metatype } = param;
      let value;
      switch (key) {
        case 'Request':
        case 'Req':
          value = req;
          break;
        case 'Query':
          value = attribute ? req.query[attribute] : req.query;
          break;
        case 'Headers':
          value = attribute ? req.headers[attribute] : req.headers;
        case 'Session':
          value = req.session;
          break;
        case 'Ip':
          value = req.ip;
          break;
        case 'Param':
          value = attribute ? req.params[attribute] : req.params;
          break;
        case 'Body':
          value = attribute ? req.body[attribute] : req.body;
          break;
        case 'Response':
        case 'Res':
          value = res;
          break;
        case 'Next':
          value = next;
          break;
        case 'DecoratorFactory':
          value = param.factory(attribute, host);
          break;
        default:
          value = null;
          break;
      }
      for (const pipe of [...this.globalPipes, ...pipes, ...paramPipes]) {
        const pipeInstance = await this.resolvePipe(pipe);
        value = await pipeInstance.transform(value, { type: key, data: attribute, metatype });
      }
      return value;
    })
  }

  useGlobalPipes(...pipes): void {
    this.globalPipes.push(...pipes);
  }
  private async resolvePipe(pipe: any): Promise<any> {
    if (typeof pipe === 'function') {
      const dependencies = this.resolveDependencies(pipe);
      return new pipe(...dependencies);
    }
    return pipe;
  }
  async listen(port: number) {
    await this.initProviders();
    await this.initMiddlewares();
    await this.initController(this.module);
    this.app.listen(port, () => {
      Logger.log(`Application is running on: http://localhost:${port}`, 'NestApplication');
    })
  }
}
