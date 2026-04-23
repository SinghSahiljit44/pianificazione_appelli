import { Module } from '@nestjs/common';
import { CorsoDiLaureaController } from './corso-di-laurea.controller';
import { CorsoDiLaureaService } from './corso-di-laurea.service';

@Module({
  controllers: [CorsoDiLaureaController],
  providers: [CorsoDiLaureaService],
  exports: [CorsoDiLaureaService],
})
export class CorsoDiLaureaModule {}
