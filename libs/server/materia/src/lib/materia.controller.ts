import { Controller } from '@nestjs/common';
import { OrgMateriaService } from './materia.service';

@Controller('materia')
export class OrgMateriaController {
  constructor(private orgMateriaService: OrgMateriaService) {}
}
