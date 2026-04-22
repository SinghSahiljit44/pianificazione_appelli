import { Test } from '@nestjs/testing';
import { OrgDocenteService } from './docente.service';

describe('OrgDocenteService', () => {
  let service: OrgDocenteService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [OrgDocenteService],
    }).compile();

    service = module.get(OrgDocenteService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
