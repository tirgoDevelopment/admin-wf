import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import entities from './main/index';
import { MainModule } from './main/main.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './shared/auth/auth.guard';
import { UploadModule } from './shared/upload/upload.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      password: 'postgres',
      username: 'postgres',
      entities: entities,
      database: 'tirgo',
      synchronize: true,
      logging: true,
    }),
    MainModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule { }
