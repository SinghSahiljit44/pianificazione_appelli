import { Test } from '@nestjs/testing';
import { OrgAppelloService } from './appello.service';

describe('OrgAppelloService', () => {
  let service: OrgAppelloService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [OrgAppelloService],
    }).compile();

    service = module.get(OrgAppelloService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
