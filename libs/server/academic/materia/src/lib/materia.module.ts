import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MateriaEntity } from './materia.entity';
import { MateriaCorsoEntity } from './materia-corso.entity';
import { MateriaService } from './materia.service';
import { MateriaController } from './materia.controller';
import { MateriaRepository } from './materia.repository';
import { DocenteModule } from '@server/docente';
import { CorsoDiLaureaModule } from '@server/corso-di-laurea';

@Module({
  imports: [
    TypeOrmModule.forFeature([MateriaEntity, MateriaCorsoEntity]),
    forwardRef(() => DocenteModule),
    forwardRef(() => CorsoDiLaureaModule),
  ],
  controllers: [MateriaController],
  providers: [MateriaService, MateriaRepository],
  exports: [MateriaService],
})
export class MateriaModule {}