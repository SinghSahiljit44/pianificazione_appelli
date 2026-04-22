import { Controller } from '@nestjs/common';
import { OrgDocenteService } from './docente.service';

@Controller('docente')
export class OrgDocenteController {
  constructor(private orgDocenteService: OrgDocenteService) {}
}
