import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { BookService } from './book/book.service';
import { BookModule } from './book/book.module';

import {MongooseModule} from "@nestjs/mongoose";
import {ConfigModule} from '@nestjs/config';
import * as process from "node:process";

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot("mongodb://localhost:27017/book"),
    BookModule,
  ],
  controllers: [AppController],
  providers: [AppService, BookService],
})
export class AppModule {}
