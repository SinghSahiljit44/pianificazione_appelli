import { Test } from '@nestjs/testing';
import { OrgMateriaService } from './materia.service';

describe('OrgMateriaService', () => {
  let service: OrgMateriaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [OrgMateriaService],
    }).compile();

    service = module.get(OrgMateriaService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
