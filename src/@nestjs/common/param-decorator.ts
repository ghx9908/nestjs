

import 'reflect-metadata'

function createParamDecorator(key) {


  return (attribute?: any) => {

    return (target, propertyKey, parameterIndex) => {

      const existingParameters = Reflect.getMetadata(`params:${String(propertyKey)}`, target, propertyKey) || [];

      existingParameters.push({
        index: parameterIndex,
        key,
        attribute
      })

      Reflect.defineMetadata(`params:${String(propertyKey)}`, existingParameters, target, propertyKey);

    }


  }


}



export const Req = createParamDecorator('Req')
export const Request = createParamDecorator('Request')
