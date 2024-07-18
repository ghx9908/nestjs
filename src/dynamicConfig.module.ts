import { Module, DynamicModule } from '@nestjs/common';
@Module({
  providers: [
    { provide: 'PREFIX', useValue: 'prefix' }
  ],
  exports: ['PREFIX']
})
export class DynamicConfigModule {
  static forRoot(configValue): DynamicModule {
    const providers: any = [
      {
        provide: 'CONFIG',
        useValue: configValue
      }
    ];

    return {
      module: DynamicConfigModule,
      providers,
      exports: providers.map(provider => (provider instanceof Function ? provider : provider.provide))
    };
  }
}
