import { Test, TestingModule } from '@nestjs/testing';
import { VariantesService } from './variantes.service';
import { PrismaService } from '../prisma/prisma.service';

describe('VariantesService', () => {
  let service: VariantesService;

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VariantesService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<VariantesService>(VariantesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
