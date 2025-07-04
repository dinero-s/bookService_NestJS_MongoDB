import { Injectable } from '@nestjs/common';
import CreateBookDTO from '../dto/createBookDTO';
import UpdateBookDto from '../dto/updateBookDTO';
import { Book, BookDocument } from '../schemas/book.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class BookService {
  constructor(@InjectModel(Book.name) private bookModel: Model<BookDocument>) {}

  public createBook(book: CreateBookDTO): Promise<BookDocument> {
    const newBook = new this.bookModel(book);
    return newBook.save();
  }

  public async findAllBooks(): Promise<BookDocument[]> {
    return this.bookModel.find().exec();
  }

  public async findBookById(id: string) {
    const book = await this.bookModel.findById(id).exec();
    return book;
  }

  public async updateBook(id: string, updateBook: UpdateBookDto) {
    await this.findBookById(id);

    const newUpdatedBook = await this.bookModel
      .findByIdAndUpdate(id, updateBook, {
        new: true,
        runValidators: true,
      })
      .exec();
    return newUpdatedBook;
  }

  public async deleteBookById(id: string): Promise<string> {
    await this.bookModel.deleteOne({ _id: id }).exec();
    return 'true';
  }
}
