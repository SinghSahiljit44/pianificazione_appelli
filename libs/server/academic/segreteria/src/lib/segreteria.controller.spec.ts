import { Test } from '@nestjs/testing';
import { OrgSegreteriaController } from './segreteria.controller';
import { OrgSegreteriaService } from './segreteria.service';

describe('OrgSegreteriaController', () => {
  let controller: OrgSegreteriaController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [OrgSegreteriaService],
      controllers: [OrgSegreteriaController],
    }).compile();

    controller = module.get(OrgSegreteriaController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
