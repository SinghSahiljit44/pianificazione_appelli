import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MateriaEntity } from '@server/academic-entities';
import { AppelloEntity, MateriaCorsoEntity } from '@server/academic-entities';
import { MateriaService } from './materia.service';
import { MateriaController } from './materia.controller';
import { MateriaRepository } from './materia.repository';
import { DocenteModule } from '@server/docente';
import { CorsoDiLaureaModule } from '@server/corso-di-laurea';

@Module({
  imports: [
    TypeOrmModule.forFeature([MateriaEntity, MateriaCorsoEntity, AppelloEntity]),
    DocenteModule,
    CorsoDiLaureaModule,
  ],
  controllers: [MateriaController],
  providers: [MateriaService, MateriaRepository],
  exports: [MateriaService],
})
export class MateriaModule {}
