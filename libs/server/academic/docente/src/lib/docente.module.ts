import { Module } from '@nestjs/common';
import { DocenteController } from './docente.controller';
import { DocenteService } from './docente.service';

@Module({
  controllers: [DocenteController],
  providers: [DocenteService],
  exports: [DocenteService],
})
export class OrgDocenteModule {}
