import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './book.service';
import { getModelToken } from '@nestjs/mongoose';
import CreateBookDTO from '../dto/createBookDTO';

describe('BooksService', () => {
  beforeEach(async () => {
    await Test.createTestingModule({
      providers: [
        BookService,
        {
          provide: getModelToken('Book'),
          useValue: {
            new: jest.fn(),
            constructor: jest.fn(),
            find: jest.fn().mockReturnValue({ exec: jest.fn() }),
            findById: jest.fn().mockReturnValue({ exec: jest.fn() }),
            findByIdAndUpdate: jest.fn().mockReturnValue({ exec: jest.fn() }),
            deleteOne: jest.fn().mockReturnValue({ exec: jest.fn() }),
            prototype: {
              save: jest.fn(),
            },
          },
        },
      ],
    }).compile();
  });

  it('Должна сохраниться книга', async () => {
    const mockSavedBook = {
      _id: 'id',
      ...CreateBookDTO,
    };

    const mockBookInstance = {
      save: jest.fn().mockResolvedValue(mockSavedBook),
    };

    const mockBookModel = jest.fn().mockImplementation(() => mockBookInstance);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        {
          provide: getModelToken('Book'),
          useValue: mockBookModel,
        },
      ],
    }).compile();

    const service = module.get<BookService>(BookService);

    const result = await service.createBook({
      title: 'Test Title',
      author: 'Test Author',
      description: 'Test Desc',
    });

    expect(mockBookModel).toHaveBeenCalledWith({
      title: 'Test Title',
      author: 'Test Author',
      description: 'Test Desc',
    });
    expect(mockBookInstance.save).toHaveBeenCalled();
    expect(result).toEqual(mockSavedBook);
  });

  it('Получить книгу по ID', async () => {
    const id = 'id';
    const mockBook = {
      _id: id,
      title: 'Test title',
      author: 'Test author',
      description: 'Test Desc',
    };
    jest.fn().mockResolvedValue(mockBook);
    const mockBookModel = {
      findById: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockBook),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        {
          provide: getModelToken('Book'),
          useValue: mockBookModel,
        },
      ],
    }).compile();

    const service = module.get<BookService>(BookService);

    const result = await service.findBookById(id);
    expect(mockBookModel.findById).toHaveBeenCalledWith(id);
    expect(result).toEqual(mockBook);
  });
  it('Найти все книги', async () => {
    const mockBooks = [
      {
        _id: '1',
        title: 'Book One',
        author: 'Author One',
        description: 'Desc 1',
      },
      {
        _id: '2',
        title: 'Book Two',
        author: 'Author Two',
        description: 'Desc 2',
      },
    ];

    const mockBookModel = {
      find: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockBooks),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        {
          provide: getModelToken('Book'),
          useValue: mockBookModel,
        },
      ],
    }).compile();

    const service = module.get<BookService>(BookService);

    const result = await service.findAllBooks();

    expect(mockBookModel.find).toHaveBeenCalled();
    expect(result).toEqual(mockBooks);
  });
  it('Обновить книгу', async () => {
    const id = 'id';
    const dto = {
      title: 'Book Two',
      author: 'Author Two',
      description: 'Desc 2',
    };
    const mockBook = { _id: id, title: 'Old' };
    const updatedBook = { _id: id, title: 'Updated' };

    const mockBookModel = {
      findById: jest
        .fn()
        .mockReturnValue({ exec: jest.fn().mockResolvedValue(mockBook) }),
      findByIdAndUpdate: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedBook),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        {
          provide: getModelToken('Book'),
          useValue: mockBookModel,
        },
      ],
    }).compile();

    const service = module.get<BookService>(BookService);

    const result = await service.updateBook(id, dto);
    expect(mockBookModel.findByIdAndUpdate).toHaveBeenCalledWith(id, dto, {
      new: true,
      runValidators: true,
    });
    expect(result).toEqual(updatedBook);
  });
  it('Удалить книгу', async () => {
    const id = 'id';

    const mockBookModel = {
      deleteOne: jest
        .fn()
        .mockReturnValue({ exec: jest.fn().mockResolvedValue(null) }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        {
          provide: getModelToken('Book'),
          useValue: mockBookModel,
        },
      ],
    }).compile();

    const service = module.get<BookService>(BookService);

    const result = await service.deleteBookById(id);
    expect(mockBookModel.deleteOne).toHaveBeenCalledWith({ _id: id });
    expect(result).toBe('true');
  });
});
