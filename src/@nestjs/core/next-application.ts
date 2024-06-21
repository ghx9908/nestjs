import express, { Express, Request as ExpressRequest, Response as ExpressResponse, NextFunction } from 'express';
import { Logger } from './logger';
import path from 'path'
export class NestApplication {
  private readonly app: Express = express()
  private readonly module: any

  constructor(module: any) {
    this.module = module
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

        if (httpMethod) {
          const routePath = path.posix.join('/', prefix, pathMetadata)
          this.app[httpMethod.toLowerCase()](routePath, async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {

            const result = await method.call(controller)
            res.send(result)
          })
          // 记录日志：映射路由路径和 HTTP 方法
          Logger.log(`Mapped {${routePath}, ${httpMethod}} route`, 'RouterExplorer');


        }

      }





    }






  }



  async listen(port: number) {
    await this.init()
    this.app.listen(port, () => {
      Logger.log(`Application is running on: http://localhost:${port}`, 'NestApplication');
    })
  }

}
