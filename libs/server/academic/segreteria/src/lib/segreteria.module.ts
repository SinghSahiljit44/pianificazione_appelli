import { Module } from '@nestjs/common';
import { SegreteriaController } from './segreteria.controller';
import { SegreteriaService } from './segreteria.service';

@Module({
  controllers: [SegreteriaController],
  providers: [SegreteriaService],
  exports: [SegreteriaService],
})
export class SegreteriaModule {}
