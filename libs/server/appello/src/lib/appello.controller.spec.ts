import { Test } from '@nestjs/testing';
import { OrgAppelloController } from './appello.controller';
import { OrgAppelloService } from './appello.service';

describe('OrgAppelloController', () => {
  let controller: OrgAppelloController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [OrgAppelloService],
      controllers: [OrgAppelloController],
    }).compile();

    controller = module.get(OrgAppelloController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
