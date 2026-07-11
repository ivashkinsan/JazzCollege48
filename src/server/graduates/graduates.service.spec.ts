
import { Test, TestingModule } from '@nestjs/testing';
import { GraduatesService } from './graduates.service';
import { NotFoundException } from '@nestjs/common';
import type { Database } from 'better-sqlite3';
import * as fs from 'fs/promises';

// Mock dependencies
jest.mock('fs/promises', () => ({
  copyFile: jest.fn().mockResolvedValue(undefined),
  unlink: jest.fn().mockResolvedValue(undefined),
}));
jest.mock('../utils/generate-static-data', () => ({
  generateStaticData: jest.fn().mockResolvedValue(undefined),
}));

const mockDb = {
  prepare: jest.fn(),
};
const mockStmt = {
  all: jest.fn(),
  get: jest.fn(),
  run: jest.fn(),
};

describe('GraduatesService', () => {
  let service: GraduatesService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GraduatesService,
        {
          provide: 'DATABASE_CONNECTION',
          useValue: mockDb,
        },
      ],
    }).compile();

    service = module.get<GraduatesService>(GraduatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all graduates', () => {
      const mockGraduates = [{ id: 1, name: 'John Doe', image_src: 'path', is_featured: 1 }];
      mockStmt.all.mockReturnValue(mockGraduates);

      const result = service.findAll();

      expect(mockDb.prepare).toHaveBeenCalledWith(expect.stringContaining('SELECT * FROM graduates'));
      expect(result).toEqual([
        { ...mockGraduates[0], image: 'path', isFeatured: true },
      ]);
    });
  });

  describe('findOne', () => {
    it('should return a single graduate', () => {
      const mockGraduate = { id: 1, name: 'John Doe', is_featured: 0 };
      mockStmt.get.mockReturnValue(mockGraduate);

      const result = service.findOne('1');

      expect(mockDb.prepare).toHaveBeenCalledWith('SELECT * FROM graduates WHERE id = ?');
      expect(mockStmt.get).toHaveBeenCalledWith('1');
      expect(result).toEqual({ ...mockGraduate, is_featured: false });
    });

    it('should throw NotFoundException if graduate not found', () => {
      mockStmt.get.mockReturnValue(undefined);
      expect(() => service.findOne('1')).toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a graduate without a file', async () => {
        const body = { name: 'Jane Doe', graduation_year: 2024 };
        mockStmt.run.mockReturnValue({ lastInsertRowid: 2 });

        const result = await service.create(body, undefined);

        expect(mockDb.prepare).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO graduates'));
        expect(mockStmt.run).toHaveBeenCalled();
        expect(fs.copyFile).not.toHaveBeenCalled();
        expect(result).toEqual({ id: 2 });
    });

    it('should create a graduate with a file', async () => {
        const body = { name: 'Jane Doe', graduation_year: 2024 };
        const file = { path: 'temp/path', originalname: 'jane.jpg' } as any;
        mockStmt.run.mockReturnValue({ lastInsertRowid: 2 });

        await service.create(body, file);

        expect(fs.copyFile).toHaveBeenCalled();
        expect(fs.unlink).toHaveBeenCalledWith('temp/path');
        expect(mockStmt.run).toHaveBeenCalledWith(body.name, body.graduation_year, undefined, undefined, expect.stringContaining('/vipuskniki/jane.jpg'), undefined, 0);
    });
  });

  describe('remove', () => {
    it('should remove a graduate', async () => {
        mockStmt.run.mockReturnValue({ changes: 1 });
        const result = await service.remove('1');
        expect(mockDb.prepare).toHaveBeenCalledWith('DELETE FROM graduates WHERE id = ?');
        expect(mockStmt.run).toHaveBeenCalledWith('1');
        expect(result).toEqual({ success: true });
    });

    it('should throw NotFoundException if graduate to remove is not found', async () => {
        mockStmt.run.mockReturnValue({ changes: 0 });
        await expect(service.remove('1')).rejects.toThrow(NotFoundException);
    });
  });
});
