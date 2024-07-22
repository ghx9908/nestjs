import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class CustomPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    console.log(`Value: ${value}, Metadata: ${JSON.stringify(metadata)}`);
    return value;
  }
}
