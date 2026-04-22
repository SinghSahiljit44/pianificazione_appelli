import { Controller } from '@nestjs/common';
import { OrgSessioneService } from './sessione.service';

@Controller('sessione')
export class OrgSessioneController {
  constructor(private orgSessioneService: OrgSessioneService) {}
}
