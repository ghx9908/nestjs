
export interface ArgumentMetadata {
  type: 'body' | 'query' | 'param' | 'custom';
  metatype?: new (...args: any[]) => any;
  data?: string;
}
