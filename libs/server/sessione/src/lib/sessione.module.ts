import { Module } from '@nestjs/common';
import { OrgSessioneController } from './sessione.controller';
import { OrgSessioneService } from './sessione.service';

@Module({
  controllers: [OrgSessioneController],
  providers: [OrgSessioneService],
  exports: [OrgSessioneService],
})
export class OrgSessioneModule {}
