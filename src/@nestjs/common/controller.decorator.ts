

interface ControllerOptions {
  prefix?: string;
}

export function Controller(prefixOrOptions?) {
  let option: ControllerOptions = {}
  if (typeof prefixOrOptions === 'string') {
    option.prefix = prefixOrOptions
  } else if (typeof prefixOrOptions === 'object') {
    option = prefixOrOptions
  }

  return (target) => {


    Reflect.defineMetadata('prefix', option.prefix, target)
  }

}
