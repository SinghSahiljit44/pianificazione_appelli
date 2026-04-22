import { Controller } from '@nestjs/common';
import { OrgSegreteriaService } from './segreteria.service';

@Controller('segreteria')
export class OrgSegreteriaController {
  constructor(private orgSegreteriaService: OrgSegreteriaService) {}
}
