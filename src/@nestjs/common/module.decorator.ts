
import 'reflect-metadata'

interface MoudleMetadata {
  controllers?: Function[]
}

export function Module(metadata: MoudleMetadata): ClassDecorator {
  return (target: Function) => {
    Reflect.defineMetadata('controllers', metadata.controllers, target)
  }
}
