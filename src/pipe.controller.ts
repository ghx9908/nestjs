import { Body, DefaultValuePipe, Post, UsePipes } from "@nestjs/common";
import { Controller, Get, Param, ParseArrayPipe, ParseBoolPipe, ParseFloatPipe, ParseIntPipe, Query } from "@nestjs/common";
import { CustomPipe } from './custom.pipe';
import { ZodValidationPipe } from "./zod-validation.pipe";
import { CreateCatDto, createCatSchema } from "./create-cat.dto";

import { ClassValidationPipe } from './class-validation.pipe';
import { CreateUserDto } from './create-user.dto';
@Controller('pipe')
export class PipeController {

  @Get()
  index() {
    return 'Hello World'
  }
  @Get('number/:id')
  getNumber(@Param('id', ParseIntPipe) id: number): string {
    return `The number is ${id}`;
  }
  @Get('float/:value')
  getFloat(@Param('value', ParseFloatPipe) value: number): string {
    return `The float value is ${value}`;
  }
  @Get('bool/:flag')
  getBool(@Param('flag', ParseBoolPipe) flag: boolean): string {
    return `The boolean value is ${flag}`;
  }
  @Get('array/:values')
  getArray(@Param('values', new ParseArrayPipe({ items: String, separator: ',' })) values: string[]): string {
    return `The array values are ${values.join(', ')}`;
  }

  @Get('default')
  getDefault(@Query('name', new DefaultValuePipe('Guest')) name: string): string {
    return `Hello, ${name}`;
  }

  @Get('custom/:value')
  getCustom(@Param('value', CustomPipe) value: any): string {
    return `The custom value is ${value}`;
  }
  @Post('cat')
  @UsePipes(new ZodValidationPipe(createCatSchema))
  async create(@Body() createCatDto: CreateCatDto) {
    return `This is a cat`;
  }

  @Post('user')
  async userCreate(@Body(new ClassValidationPipe()) createUserDto: CreateUserDto) {
    console.log('createUserDto', createUserDto);
    return 'This action adds a new user';
  }

  @Post('users/global')
  async createGlobalUser(@Body() createUserDto: CreateUserDto): Promise<string> {
    console.log('Global Create User DTO:', createUserDto);
    return 'This action adds a new user globally';
  }

}
