import { Controller } from '@nestjs/common';
import { OrgCorsoDiLaureaService } from './corso-di-laurea.service';

@Controller('corso-di-laurea')
export class OrgCorsoDiLaureaController {
  constructor(private orgCorsoDiLaureaService: OrgCorsoDiLaureaService) {}
}
