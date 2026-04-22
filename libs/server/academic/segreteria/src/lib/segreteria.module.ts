import { Module } from '@nestjs/common';
import { OrgSegreteriaController } from './segreteria.controller';
import { OrgSegreteriaService } from './segreteria.service';

@Module({
  controllers: [OrgSegreteriaController],
  providers: [OrgSegreteriaService],
  exports: [OrgSegreteriaService],
})
export class OrgSegreteriaModule {}
