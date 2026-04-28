import { Test, TestingModule } from '@nestjs/testing';
import { VariantesController } from './variantes.controller';
import { VariantesService } from './variantes.service';
import { PrismaService } from '../prisma/prisma.service';

describe('VariantesController', () => {
  let controller: VariantesController;

  const mockPrismaService = {
    variantePerfume: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockVariantesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    activate: jest.fn(),
    updateStock: jest.fn(),
    findBySku: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VariantesController],
      providers: [
        { provide: VariantesService, useValue: mockVariantesService },
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    controller = module.get<VariantesController>(VariantesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
