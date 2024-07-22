// 从 @nestjs/common 导入 PipeTransform, Injectable, ArgumentMetadata, BadRequestException
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
// 从 class-validator 导入 validate, ValidationError
import { validate, ValidationError } from 'class-validator';
// 从 class-transformer 导入 plainToInstance
import { plainToInstance } from 'class-transformer';
// 声明这个类是一个可注入的服务
@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  // 实现 transform 方法，该方法是管道的核心逻辑
  async transform(value: any, { metatype }: ArgumentMetadata) {
    // 如果没有元类型或者元类型不需要验证，则直接返回值
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    // 将普通对象转换为类实例
    const object = plainToInstance(metatype, value);
    // 验证对象
    const errors = await validate(object);
    // 如果存在验证错误，抛出 BadRequestException 异常
    if (errors.length > 0) {
      console.log('this.formatErrors(errors)=>', this.formatErrors(errors))
      throw new BadRequestException(this.formatErrors(errors));
    }
    // 如果验证通过，返回值
    return value;
  }
  // 检查给定的元类型是否需要验证
  private toValidate(metatype: Function): boolean {
    // 需要排除的原生类型
    const types: Function[] = [String, Boolean, Number, Array, Object];
    // 如果元类型在排除列表中，则不需要验证
    return !types.includes(metatype);
  }
  // 格式化验证错误信息
  private formatErrors(errors: ValidationError[]) {
    // 将每个错误信息格式化为字符串，并用逗号分隔
    return errors
      .map(err => {
        for (const property in err.constraints) {
          return `${err.property} - ${err.constraints[property]}`;
        }
      })
      .join(', ');
  }
}
