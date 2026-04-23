import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocenteEntity } from './docente.entity';
import { DocenteService } from './docente.service';
import { DocenteController } from './docente.controller';
import { DocenteRepository } from './docente.repository';

@Module({
  imports: [TypeOrmModule.forFeature([DocenteEntity])],
  controllers: [DocenteController],
  providers: [DocenteService, DocenteRepository],
  exports: [DocenteService],
})
export class DocenteModule {}