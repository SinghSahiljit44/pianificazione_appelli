import { Module } from '@nestjs/common';
import { OrgDocenteController } from './docente.controller';
import { OrgDocenteService } from './docente.service';

@Module({
  controllers: [OrgDocenteController],
  providers: [OrgDocenteService],
  exports: [OrgDocenteService],
})
export class OrgDocenteModule {}
