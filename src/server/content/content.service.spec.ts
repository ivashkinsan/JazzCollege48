
import { Test, TestingModule } from '@nestjs/testing';
import { ContentService } from './content.service';
import { BadRequestException } from '@nestjs/common';
import type { Database } from 'better-sqlite3';

// Mock the generateStaticData function
jest.mock('../utils/generate-static-data', () => ({
  generateStaticData: jest.fn().mockResolvedValue(undefined),
}));

// Create a mock of the database
const mockDb = {
  prepare: jest.fn(() => mockStmt), // ensure prepare returns mockStmt
};

// Mock the statement object that `prepare` returns
const mockStmt = {
  all: jest.fn(),
  run: jest.fn(),
  get: jest.fn(),
};

describe('ContentService', () => {
  let service: ContentService;
  let db: Database;

  beforeEach(async () => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContentService,
        {
          provide: 'DATABASE_CONNECTION',
          useValue: mockDb,
        },
      ],
    }).compile();

    service = module.get<ContentService>(ContentService);
    db = module.get<Database>('DATABASE_CONNECTION');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAdminList', () => {
    it('should get photoalbums with the correct query', () => {
      const manager = 'photoalbum';
      
      // Mock the return value for this specific test
      mockStmt.all.mockReturnValue([{ id: 1, title: 'Test Album' }]);
      
      const result = service.getAdminList(manager);

      // Check that `prepare` was called with the correct query component
      expect(db.prepare).toHaveBeenCalledWith(expect.stringContaining('WHERE category = ?'));
      
      // Check that the statement was executed with the correct parameter
      expect(mockStmt.all).toHaveBeenCalledWith(manager);

      // Check the result
      expect(result).toEqual([{ id: 1, title: 'Test Album' }]);
    });

    it('should get news with the correct query', () => {
        const manager = 'news';
        
        mockStmt.all.mockReturnValue([{ id: 2, title: 'Test News' }]);
        
        const result = service.getAdminList(manager);
  
        expect(db.prepare).toHaveBeenCalledWith(expect.stringContaining('WHERE category = ?'));
        expect(mockStmt.all).toHaveBeenCalledWith(manager);
        expect(result).toEqual([{ id: 2, title: 'Test News' }]);
      });

    it('should get graduates with the correct ordering', () => {
      const manager = 'graduates';
      
      service.getAdminList(manager);

      expect(db.prepare).toHaveBeenCalledWith(
        expect.stringContaining('ORDER BY graduation_year DESC')
      );
    });

    it('should throw BadRequestException for invalid manager', () => {
        const manager = 'invalid_manager';
        expect(() => service.getAdminList(manager)).toThrow(BadRequestException);
    });
  });
});
