import { Controller } from '@nestjs/common';
import { OrgAppelloService } from './appello.service';

@Controller('appello')
export class OrgAppelloController {
  constructor(private orgAppelloService: OrgAppelloService) {}
}
