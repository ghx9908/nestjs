
import 'reflect-metadata'

interface ModuleMetadata {
  controllers?: Function[]
  providers?: any
  exports?: any[];//模块的导出 把自己的一部分provides 导出
  imports?: any[]; // 导入别的模块
}

export function Module(metadata: ModuleMetadata): ClassDecorator {
  return (target: Function) => {
    Reflect.defineMetadata('isModule', true, target);
    Reflect.defineMetadata('controllers', metadata.controllers, target)
    defineModule(target, metadata.controllers);
    Reflect.defineMetadata('providers', metadata.providers, target)
    defineModule(target, metadata.providers ?? []);
    Reflect.defineMetadata('exports', metadata.exports, target);
    Reflect.defineMetadata('imports', metadata.imports, target);
  }
}

export function defineModule(nestModule, targets = []) {
  //遍历targets数组，为每个元素添加元数据，key是nestModule,值是对应的模块
  targets.forEach(target => {
    Reflect.defineMetadata('module', nestModule, target);
  })
}
export function Global(): ClassDecorator {
  return (target: Function) => {
    Reflect.defineMetadata('global', true, target);
  };
}

export interface DynamicModule extends ModuleMetadata {
  module: Function;
}
