# nest 源码实现

- 英文文档： https://nestjs.com/
- 中文文档：https://nest.nodejs.cn/
  https://nestjs.inode.club/

## 基本知识

### 包名及介绍

| 包名             | 介绍                                                                                      |
| :--------------- | :---------------------------------------------------------------------------------------- |
| @nestjs/common   | NestJS 的公共模块，包含各种装饰器、工具函数和中间件，用于构建 NestJS 应用程序的核心功能。 |
| @nestjs/core     | NestJS 的核心模块，提供创建 NestJS 应用程序的基础设施，包括依赖注入、模块系统等。         |
| express-session  | 用于 Express 框架的会话中间件，支持会话数据的存储和管理。                                 |
| reflect-metadata | 用于在 TypeScript 和 JavaScript 中实现反射的库，支持元数据的定义和读取。                  |
| rxjs             | Reactive Extensions for JavaScript，提供基于 Observable 的响应式编程库。                  |
| nodemon          | 一个 Node.js 工具，用于在检测到文件更改时自动重新启动应用程序。                           |
| ts-node          | 一个 TypeScript 执行引擎，允许直接运行 TypeScript 代码而无需预先编译。                    |
| tsconfig-paths   | 一个工具，用于解析 TypeScript 配置文件中的路径映射，支持模块路径的别名。                  |

### reflect-metadat

#### 装饰器

在 TypeScript 中，装饰器是一种特殊类型的声明，它能够附加到类声明、方法、访问符、属性或参数上，可以修改类的行为。装饰器是一个实验性的特性，需要在 `tsconfig.json` 文件中启用 `experimentalDecorators` 编译器选项。

**装饰器的类型**

1. **类装饰器（Class Decorators）**：应用于类构造函数，可以用于修改类的定义。
2. **方法装饰器（Method Decorators）**：应用于方法，可以用于修改方法的行为。
3. **访问器装饰器（Accessor Decorators）**：应用于类的访问器属性（getter 或 setter）。
4. **属性装饰器（Property Decorators）**：应用于类的属性。
5. **参数装饰器（Parameter Decorators）**：应用于方法参数。

| 装饰器名称                          | 装饰器描述                                 | 装饰器的参数说明                                                      |
| :---------------------------------- | :----------------------------------------- | :-------------------------------------------------------------------- |
| 类装饰器（Class Decorators）        | 应用于类构造函数，可以用于修改类的定义。   | `constructor: Function`                                               |
| 方法装饰器（Method Decorators）     | 应用于方法，可以用于修改方法的行为。       | `target: Object, propertyKey: string, descriptor: PropertyDescriptor` |
| 访问器装饰器（Accessor Decorators） | 应用于类的访问器属性（getter 或 setter）。 | `target: Object, propertyKey: string, descriptor: PropertyDescriptor` |
| 属性装饰器（Property Decorators）   | 应用于类的属性。                           | `target: Object, propertyKey: string`                                 |
| 参数装饰器（Parameter Decorators）  | 应用于方法参数。                           | `target: Object, propertyKey: string, parameterIndex: number`         |

#### 类装饰器添加元数据

```ts
import "reflect-metadata"

interface MoudleMetadata {
  controllers?: Function[]
}

// target 为这个类 constructor
export function Module(metadata: MoudleMetadata): ClassDecorator {
  return (target: Function) => {
    Reflect.defineMetadata("controllers", metadata.controllers, target)
  }
}

@Module({
  controllers: [AppController, UserController],
})
export class AppModule {}

//  const controllers = Reflect.getMetadata('controllers', this.module) 获取
```

#### 方法装饰器添加元数据

```ts
import "reflect-metadata"
export function Get(path: string = "") {
  return (target, propertyKey, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata("path", path, descriptor.value)
    Reflect.defineMetadata("method", "GET", descriptor.value)
  }
}

//获取  method为这个方法 target为类的原型
const httpMethod = Reflect.getMetadata("method", method)
```

#### 参数装饰器添加元数据

```ts
export const createParamDecorator = (keyOrFactory: string | Function) => {
  return (attribute?: any) => {
    return (target, propertyKey, parameterIndex) => {
      Reflect.defineMetadata(`params:${String(propertyKey)}`, value, target, propertyKey)
    }
  }
}

// 获取   instance 类的实例   methodName方法名 target 为原型对象
Reflect.getMetadata(`params:${methodName}`, instance, methodName) || []
```

### nodemon.json

```json
{
  "watch": ["src"],
  "ext": "ts,js,json",
  "ignore": ["node_modules"],
  "exec": "ts-node -r tsconfig-paths/register src/main.ts"
}
```

- **作用**: 指定 `nodemon` 需要监视的目录或文件，当这些目录或文件发生变化时，`nodemon` 会自动重启应用程序。
- **`"watch": ["src"]`**: 表示 `nodemon` 将监视 `src` 目录中的所有文件和子目录。
- **`"ext": "ts,js,json"`**: 表示 `nodemon` 将监视具有 `.ts`、`.js` 和 `.json` 扩展名的文件。
- **`"ignore": ["node_modules"]`**: 表示 `nodemon` 将忽略 `node_modules` 目录中的所有文件和子目录。
- **`"ts-node -r tsconfig-paths/register src/main.ts"`**: 表示 `nodemon` 将使用 `ts-node` 执行 `src/main.ts` 文件，并在执行前预加载 `tsconfig-paths/register` 模块以支持路径映射。
- 综上，`nodemon.json` 文件的配置使得 `nodemon` 工具会监视 `src` 目录中的 `.ts`、`.js` 和 `.json` 文件的变化，忽略 `node_modules` 目录，并在文件变化时自动使用 `ts-node` 执行 `src/main.ts` 文件。

### launch.json

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Program",
      "skipFiles": ["<node_internals>/**"],
      "runtimeExecutable": "ts-node",
      "runtimeArgs": ["-r", "tsconfig-paths/register"],
      "args": ["${workspaceFolder}/src/main.ts"],
      "cwd": "${workspaceFolder}"
    }
  ]
}
```

- `version`: 指定配置文件的版本。

- `configurations`: 包含一个或多个调试配置，每个配置定义了一种调试场景。

- `type`: 指定调试器类型。

- `request`: 指定调试请求类型。 `"launch"`: 表示启动程序并进行调试。

- `name`: 指定此配置的名称，在调试配置下拉菜单中显示。

- `skipFiles`: 指定调试时应跳过的文件或文件夹。

- `runtimeExecutable`: 指定要使用的运行时可执行文件。 `"ts-node"`: 使用 ts-node 直接运行 TypeScript 代码。

- ```
  runtimeArgs
  ```

  : 指定运行时的参数。

  - `"-r"`: 表示在执行脚本之前预加载模块。
  - `"tsconfig-paths/register"`: 预加载 `tsconfig-paths/register` 模块以支持路径映射。

- ```
  args
  ```

  : 指定要调试的程序的参数。

  - `${workspaceFolder}/src/main.ts`: 表示要调试的 TypeScript 文件的路径，其中 `${workspaceFolder}` 表示当前工作区的根目录。

- `cwd`: 指定调试器的当前工作目录。

该 launch.json 配置文件定义了一个名为 "Launch Program" 的调试配置，用于使用 ts-node 调试位于 src/main.ts 的 TypeScript 程序。配置包括跳过 Node.js 内部模块的文件、预加载 tsconfig-paths/register 模块以支持路径映射，并在当前工作区目录下运行调试器。

### package.json

```json
{
  "scripts": {
    "start": "ts-node -r tsconfig-paths/register ./src/main.ts",
    "start:dev": "nodemon"
  }
}
```

- **`ts-node`**: 这是一个用于直接运行 TypeScript 代码的工具，它允许在不预先编译的情况下运行 `.ts` 文件。
- **`-r tsconfig-paths/register`**: 这里的 `-r` 是 `--require` 的缩写，用于在执行脚本之前预加载模块。`tsconfig-paths/register` 模块用于处理 TypeScript 配置中的路径映射。
- **`./src/main.ts`**: 这是应用程序的入口文件。`ts-node` 将运行这个 TypeScript 文件。

## 核心模块

### 中间件

> Middleware 是在路由处理程序之前调用的函数。中间件函数可以访问请求和响应对象，以及应用程序的请求-响应周期中的 next()中间件函数。通常，next 中间件函数由一个名为 next 的变量表示。

中间件函数可以执行以下任务：

- 执行任何代码。
- 对请求和响应对象进行更改。
- 结束请求-响应周期。
- 调用堆栈中的下一个中间件函数。
- 如果当前中间件函数未结束请求-响应周期，则必须调用 next()将控制权传递给下一个中间件函数。否则，请求将被搁置。

### 异常过滤器

> Nest 框架内置了一个异常处理层，负责处理应用程序中的所有未处理异常。当一个异常没有被应用程序代码处理时，它会被这个异常处理层捕获，然后自动发送一个适当的用户友好响应。
