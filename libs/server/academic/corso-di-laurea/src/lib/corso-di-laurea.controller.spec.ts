import { Test } from '@nestjs/testing';
import { OrgCorsoDiLaureaController } from './corso-di-laurea.controller';
import { OrgCorsoDiLaureaService } from './corso-di-laurea.service';

describe('OrgCorsoDiLaureaController', () => {
  let controller: OrgCorsoDiLaureaController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [OrgCorsoDiLaureaService],
      controllers: [OrgCorsoDiLaureaController],
    }).compile();

    controller = module.get(OrgCorsoDiLaureaController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
