import { ArgumentMetadata } from "./argument-metadata.interface";

export interface PipeTransform<T = any, R = any> {
  transform(value: T, metadata?: ArgumentMetadata): R;
}
