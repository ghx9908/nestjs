
import 'reflect-metadata'
export function Inject(token): ParameterDecorator {
  return function (target: any, propertyKey, parameterIndex: number) {
    const existingInjectedTokens = Reflect.getMetadata('injectedTokens', target) || [];
    existingInjectedTokens[parameterIndex] = token;
    Reflect.defineMetadata('injectedTokens', existingInjectedTokens, target);
  }
}
