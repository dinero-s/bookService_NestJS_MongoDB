import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document }  from "mongoose";

export type BookDocument = Book & Document;

@Schema()
export class Book {
    @Prop({ required: true })
    title: string;

    @Prop()
    description: string;

    @Prop()
    author: string;
}

export const BookSchema = SchemaFactory.createForClass(Book);