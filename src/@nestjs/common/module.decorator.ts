
import 'reflect-metadata'

interface MoudleMetadata {
  controllers?: Function[]
  providers?: any
  exports?: any[];//模块的导出 把自己的一部分provides 导出
  imports?: any[]; // 导入别的模块
}

export function Module(metadata: MoudleMetadata): ClassDecorator {
  return (target: Function) => {
    Reflect.defineMetadata('isModule', true, target);
    Reflect.defineMetadata('controllers', metadata.controllers, target)
    Reflect.defineMetadata('providers', metadata.providers, target)
    Reflect.defineMetadata('exports', metadata.exports, target);
    Reflect.defineMetadata('imports', metadata.imports, target);
  }
}
