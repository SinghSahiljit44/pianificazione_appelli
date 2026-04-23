import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SegreteriaEntity } from './segreteria.entity';
import { SegreteriaService } from './segreteria.service';
import { SegreteriaController } from './segreteria.controller';
import { SegreteriaRepository } from './segreteria.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SegreteriaEntity])],
  controllers: [SegreteriaController],
  providers: [SegreteriaService, SegreteriaRepository],
  exports: [SegreteriaService],
})
export class SegreteriaModule {}