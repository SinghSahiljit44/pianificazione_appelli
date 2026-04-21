import { Test } from '@nestjs/testing';
import { OrgSessioneController } from './sessione.controller';
import { OrgSessioneService } from './sessione.service';

describe('OrgSessioneController', () => {
  let controller: OrgSessioneController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [OrgSessioneService],
      controllers: [OrgSessioneController],
    }).compile();

    controller = module.get(OrgSessioneController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
