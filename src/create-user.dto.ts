// 从 'class-validator' 库中导入 IsString 和 IsInt 装饰器
import { IsString, IsInt } from 'class-validator';
// 定义一个名为 CreateUserDto 的类，用于数据传输对象（DTO）
export class CreateUserDto {
  // 使用 IsString 装饰器来验证 name 属性是一个字符串
  @IsString()
  name: string;
  // 使用 IsInt 装饰器来验证 age 属性是一个整数
  @IsInt()
  age: number;
}
