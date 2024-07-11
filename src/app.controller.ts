

import { Get, Controller } from '@nestjs/common'

@Controller()
export class AppController {
  @Get()
  index() {
    return 'hello'
  }


  @Get('info')
  info() {
    return 'info'
  }

}
