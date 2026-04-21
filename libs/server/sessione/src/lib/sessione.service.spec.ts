import { Test } from '@nestjs/testing';
import { OrgSessioneService } from './sessione.service';

describe('OrgSessioneService', () => {
  let service: OrgSessioneService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [OrgSessioneService],
    }).compile();

    service = module.get(OrgSessioneService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
