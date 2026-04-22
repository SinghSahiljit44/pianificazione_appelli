import { Module } from '@nestjs/common';
import { OrgMateriaController } from './materia.controller';
import { OrgMateriaService } from './materia.service';

@Module({
  controllers: [OrgMateriaController],
  providers: [OrgMateriaService],
  exports: [OrgMateriaService],
})
export class OrgMateriaModule {}
