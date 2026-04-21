import { Test } from '@nestjs/testing';
import { OrgSegreteriaService } from './segreteria.service';

describe('OrgSegreteriaService', () => {
  let service: OrgSegreteriaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [OrgSegreteriaService],
    }).compile();

    service = module.get(OrgSegreteriaService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
