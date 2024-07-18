import 'reflect-metadata';
export function Catch(...exceptions: any[]): ClassDecorator {
  return (target: Function) => {
    Reflect.defineMetadata('catch', exceptions, target);
  };
}
