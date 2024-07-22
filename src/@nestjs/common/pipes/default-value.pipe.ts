import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class DefaultValuePipe implements PipeTransform {
  constructor(private readonly defaultValue: any) { }

  transform(value: any): any {
    return value ? value : this.defaultValue;
  }
}
