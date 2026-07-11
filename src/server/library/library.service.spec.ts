
import { Test, TestingModule } from '@nestjs/testing';
import { LibraryService } from './library.service';
import { NotFoundException } from '@nestjs/common';
import type { Database } from 'better-sqlite3';

jest.mock('../utils/generate-static-data', () => ({
  generateStaticData: jest.fn().mockResolvedValue(undefined),
}));

const mockDb = {
  prepare: jest.fn(() => mockStmt),
};
const mockStmt = {
  all: jest.fn(),
  get: jest.fn(),
  run: jest.fn(),
};

describe('LibraryService', () => {
  let service: LibraryService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LibraryService,
        {
          provide: 'DATABASE_CONNECTION',
          useValue: mockDb,
        },
      ],
    }).compile();

    service = module.get<LibraryService>(LibraryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all links and categories', () => {
      mockStmt.all
        .mockReturnValueOnce([{ title: 'Link A' }]) // For links
        .mockReturnValueOnce([{ category: 'Cat A' }]); // For categories

      const result = service.findAll();

      expect(mockDb.prepare).toHaveBeenCalledTimes(2);
      expect(result.links).toHaveLength(1);
      expect(result.categories).toHaveLength(1);
    });

    it('should return links for a specific category', () => {
        const category = 'Videos';
        mockStmt.all
          .mockReturnValueOnce([{ title: 'Link B' }]) 
          .mockReturnValueOnce([{ category: 'Videos' }]);
  
        const result = service.findAll(category);
  
        expect(mockDb.prepare).toHaveBeenCalledWith('SELECT * FROM library_links WHERE category = ? ORDER BY title');
        expect(mockStmt.all).toHaveBeenCalledWith(category);
        expect(result.links).toHaveLength(1);
      });
  });
  
  describe('create', () => {
    it('should create a new link', async () => {
        const body = { title: 'New Link', url: 'http://a.com', category: 'Tests' };
        mockStmt.run.mockReturnValue({ lastInsertRowid: 10 });
        const result = await service.create(body);

        expect(mockDb.prepare).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO library_links'));
        expect(result).toEqual({ id: 10 });
    });
  });
});
