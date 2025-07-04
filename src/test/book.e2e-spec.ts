import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, Module } from '@nestjs/common';
import * as request from 'supertest';
import { BookController } from '../book/book.controller';
import { BookService } from '../book/book.service';

export const mockBookService: {
  createBook: jest.Mock<any, any, any>;
  findAllBooks: jest.Mock<any, any, any>;
  findBookById: jest.Mock<any, any, any>;
  updateBook: jest.Mock<any, any, any>;
  deleteBookById: jest.Mock<any, any, any>;
} = {
  createBook: jest.fn(),
  findAllBooks: jest.fn(),
  findBookById: jest.fn(),
  updateBook: jest.fn(),
  deleteBookById: jest.fn(),
};

describe('BookController (e2e)', () => {
  let app: INestApplication;

  @Module({
    controllers: [BookController],
    providers: [
      {
        provide: BookService,
        useValue: mockBookService,
      },
    ],
  })
  class TestBookModule {}

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestBookModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/book (GET) should return list of books', async () => {
    const books = [
      { _id: '1', title: 'One' },
      { _id: '2', title: 'Two' },
    ];
    mockBookService.findAllBooks.mockResolvedValue(books);

    const response = await request(app.getHttpServer())
      .get('/book')
      .expect(200);

    expect(response.body).toEqual(books);
    expect(mockBookService.findAllBooks).toHaveBeenCalled();
  });

  it('/book/:id (GET) should return a single book', async () => {
    const book = { _id: '1', title: 'One', author: 'Author' };
    mockBookService.findBookById.mockResolvedValue(book);

    const response = await request(app.getHttpServer())
      .get('/book/1')
      .expect(200);

    expect(response.body).toEqual(book);
    expect(mockBookService.findBookById).toHaveBeenCalledWith('1');
  });

  it('/book/create (POST) should create and return a book', async () => {
    const dto = { title: 'New Book', author: 'Test Author' };
    const createdBook = { _id: '123', ...dto };
    mockBookService.createBook.mockResolvedValue(createdBook);

    const response = await request(app.getHttpServer())
      .post('/book/create')
      .send(dto)
      .expect(201);

    expect(response.body).toEqual(createdBook);
    expect(mockBookService.createBook).toHaveBeenCalledWith(dto);
  });

  it('/book/:id (PUT) should update and return the book', async () => {
    const dto = { title: 'Updated Title', author: 'Updated Author' };
    const updatedBook = { _id: '1', ...dto };
    mockBookService.updateBook.mockResolvedValue(updatedBook);

    const response = await request(app.getHttpServer())
      .put('/book/1')
      .send(dto)
      .expect(200);

    expect(response.body).toEqual(updatedBook);
    expect(mockBookService.updateBook).toHaveBeenCalledWith('1', dto);
  });

  it('/book/:id (DELETE) should delete and return success', async () => {
    mockBookService.deleteBookById.mockResolvedValue({ deleted: true });

    const response = await request(app.getHttpServer())
      .delete('/book/1')
      .expect(200);

    expect(response.body).toEqual({ deleted: true });
    expect(mockBookService.deleteBookById).toHaveBeenCalledWith('1');
  });
});
