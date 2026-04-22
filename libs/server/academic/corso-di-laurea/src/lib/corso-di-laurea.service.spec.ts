import { Test } from '@nestjs/testing';
import { OrgCorsoDiLaureaService } from './corso-di-laurea.service';

describe('OrgCorsoDiLaureaService', () => {
  let service: OrgCorsoDiLaureaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [OrgCorsoDiLaureaService],
    }).compile();

    service = module.get(OrgCorsoDiLaureaService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
