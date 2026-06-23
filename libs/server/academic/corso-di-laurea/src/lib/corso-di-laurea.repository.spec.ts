import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CorsoDiLaureaRepository } from './corso-di-laurea.repository';
import { CorsoDiLaureaEntity } from './corso-di-laurea.entity';
describe('CorsoDiLaureaRepository', () => {
  let repository: CorsoDiLaureaRepository;

  const mockTypeOrmRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CorsoDiLaureaRepository,
        {
          provide: getRepositoryToken(CorsoDiLaureaEntity),
          useValue: mockTypeOrmRepository,
        },
      ],
    }).compile();

    repository = module.get<CorsoDiLaureaRepository>(CorsoDiLaureaRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
});