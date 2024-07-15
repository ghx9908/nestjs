
import 'reflect-metadata'
import { INJECTED_TOKENS } from './constants';
export function Inject(token): ParameterDecorator {
  return function (target: any, propertyKey, parameterIndex: number) {
    const existingInjectedTokens = Reflect.getMetadata(INJECTED_TOKENS, target) || [];
    existingInjectedTokens[parameterIndex] = token;
    Reflect.defineMetadata(INJECTED_TOKENS, existingInjectedTokens, target);
  }
}
