import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import CreateBookDTO from '../dto/createBookDTO';
import { BookService } from './book.service';
import { BookDocument } from '../schemas/book.schema';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}
  @Post('create')
  public async create(@Body() book: CreateBookDTO): Promise<BookDocument> {
    return this.bookService.createBook(book);
  }
  @Get()
  public async findAll(): Promise<BookDocument[]> {
    return this.bookService.findAllBooks();
  }

  @Get(':id')
  public async findById(@Param('id') id: string): Promise<BookDocument | null> {
    return this.bookService.findBookById(id);
  }
  @Put(':id')
  public updateBookById(
    @Param('id') id: string,
    @Body() book: CreateBookDTO,
  ): Promise<BookDocument | null> {
    return this.bookService.updateBook(id, book);
  }
  @Delete(':id')
  public async deleteBook(@Param('id') id: string) {
    return this.bookService.deleteBookById(id);
  }
}
