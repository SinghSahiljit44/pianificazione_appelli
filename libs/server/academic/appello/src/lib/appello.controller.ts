import { Controller } from '@nestjs/common';
import { AppelloService } from './appello.service';

@Controller('appello')
export class AppelloController {
  constructor(private appelloService: AppelloService) {}
}
