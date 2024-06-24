

import { Get, Controller, Req, Request, Query, Headers, Session, Ip, Param, Post, Body, Res, Response, Next, Redirect, HttpCode, Header } from '@nestjs/common'
import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { UrlDecorator } from './url-decorator';
@Controller('user')
export class UserController {
  @Get('req')
  index(@Req('attr') req, age, @Request() request) {
    console.log('req.method=>', req.method)
    console.log('age=>', age)
    console.log('request.url=>', request.url)
    return 'user req'
  }

  @Get('query')
  handleQuery(@Query() query: any, @Query('id') id: string): string {
    console.log('query', query);
    console.log('id', id);
    return `Query ID: ${id}`;
  }

  @Get('headers')
  handleHeaders(@Headers('accept') accept: string, @Headers() headers): string {
    console.log('accept=>', accept)
    console.log('heasers=>', headers)
    return `Header accept: ${accept}`;
  }


  @Get('session')
  handleSession(@Session() session: any): string {
    if (session.views) {
      session.views++;
    } else {
      session.views = 1;
    }
    console.log('session=>', session)
    return `Number of views: ${session.views}`;
  }
  @Get('Ip')
  handleIp(@Ip() ip: string): string {

    console.log('ip=>', ip)
    return `Ip: ${ip}`;
  }

  @Get('param/:id')
  getParamById(@Param() params, @Param('id') id: string): string {
    console.log('ID:', id);
    console.log('params=>', params)
    return `Param ID: ${id}`;
  }

  @Get(':username/info/:id')
  getParamByParam(@Param() params, @Param('username') username: string): string {
    console.log('ID:', username);
    console.log('params=>', params)
    return `Username : ${username}`;
  }
  @Get('star/ab**df')
  getParamByStar(): string {
    return `abcd`;
  }

  @Post('create')
  @Header('Cache-Control', 'none')
  @Header('key1', '1')
  @Header('key2', '2')
  @HttpCode(200)
  createUser(@Body() createUserDto, @Body('username') username): Object {
    console.log('createUserDto=>', createUserDto)
    console.log('username=>', username)
    return createUserDto
  }
  @Get('res')
  handleResponse(@Res() res: ExpressResponse, @Response() response: ExpressResponse) {
    res.send('Custom response');
    // return `response`
  }

  @Get('passthrough')
  passthrough(@Res({ passthrough: true }) res: ExpressResponse): string {
    // 仅想添加一个响应头
    res.setHeader('key', 'value')
    return 'Custom response';
  }

  @Get('next')
  next(@Next() next): string {
    // 仅想添加一个响应头
    console.log('next=>')
    next()
    return 'Custom response';
  }

  @Get('/redirect')
  @Redirect('/users', 301)
  handleRedirect(): void { }

  @Get('redirect2')
  @Redirect('/users', 302)
  handleRedirect2() {
    return { url: 'https://www.baidu.com', statusCode: 301 };
  }

  @Get('url')
  urlMethod(@UrlDecorator('url') url: any) {
    console.log('url', url);
    return url;
  }
}
