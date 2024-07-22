// 从nestjs/common中导入所需的装饰器和异常类
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
// 从class-validator中导入验证函数
import { validate } from 'class-validator';
// 从class-transformer中导入plainToInstance函数
import { plainToInstance } from 'class-transformer';
// 将类标记为可注入的依赖项
@Injectable()
export class ClassValidationPipe implements PipeTransform<any> {
  // 实现PipeTransform接口的transform方法
  async transform(value: any, { metatype }: ArgumentMetadata) {
    // 如果没有元数据类型或者不需要验证，则直接返回值
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    // 将普通对象转换为类实例
    const object = plainToInstance(metatype, value);
    // 验证对象
    const errors = await validate(object);
    // 如果有验证错误，抛出BadRequestException
    if (errors.length > 0) {
      throw new BadRequestException('Validation failed');
    }
    // 返回原始值
    return value;
  }
  // 判断是否需要验证
  private toValidate(metatype: Function): boolean {
    // 定义不需要验证的类型数组
    const types: Function[] = [String, Boolean, Number, Array, Object];
    // 如果metatype在types数组中，则不需要验证
    return !types.includes(metatype);
  }
}
