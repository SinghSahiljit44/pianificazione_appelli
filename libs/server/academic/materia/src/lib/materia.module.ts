import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MateriaEntity } from './materia.entity';
import { MateriaService } from './materia.service';
import { MateriaController } from './materia.controller';
import { MateriaRepository } from './materia.repository';

@Module({
  imports: [TypeOrmModule.forFeature([MateriaEntity])],
  controllers: [MateriaController],
  providers: [MateriaService, MateriaRepository],
  exports: [MateriaService],
})
export class MateriaModule {}