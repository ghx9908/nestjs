

import { Get, Controller, Req, Request } from '@nestjs/common'

@Controller('user')
export class UserController {
  @Get('')
  index(@Req() req, @Request() request) {
    console.log('req.method=>', req.method)
    console.log('request.url=>', request.url)
    return 'user'
  }


  @Get('info')
  info() {
    return 'info'
  }
}
