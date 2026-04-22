import { Test } from '@nestjs/testing';
import { OrgDocenteController } from './docente.controller';
import { OrgDocenteService } from './docente.service';

describe('OrgDocenteController', () => {
  let controller: OrgDocenteController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [OrgDocenteService],
      controllers: [OrgDocenteController],
    }).compile();

    controller = module.get(OrgDocenteController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
