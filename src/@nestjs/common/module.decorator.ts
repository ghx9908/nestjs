
import 'reflect-metadata'

interface MoudleMetadata {
  controllers?: Function[]
  providers?: any
}

export function Module(metadata: MoudleMetadata): ClassDecorator {
  return (target: Function) => {
    Reflect.defineMetadata('controllers', metadata.controllers, target)
    Reflect.defineMetadata('providers', metadata.providers, target)
  }
}
