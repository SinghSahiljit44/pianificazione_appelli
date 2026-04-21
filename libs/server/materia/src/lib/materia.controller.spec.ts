import { Test } from '@nestjs/testing';
import { OrgMateriaController } from './materia.controller';
import { OrgMateriaService } from './materia.service';

describe('OrgMateriaController', () => {
  let controller: OrgMateriaController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [OrgMateriaService],
      controllers: [OrgMateriaController],
    }).compile();

    controller = module.get(OrgMateriaController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
