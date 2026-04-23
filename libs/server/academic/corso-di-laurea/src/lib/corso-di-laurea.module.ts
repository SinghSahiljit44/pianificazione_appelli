import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CorsoDiLaureaEntity } from './corso-di-laurea.entity';
import { CorsoDiLaureaService } from './corso-di-laurea.service';
import { CorsoDiLaureaController } from './corso-di-laurea.controller';
import { CorsoDiLaureaRepository } from './corso-di-laurea.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CorsoDiLaureaEntity])],
  controllers: [CorsoDiLaureaController],
  providers: [CorsoDiLaureaService, CorsoDiLaureaRepository],
  exports: [CorsoDiLaureaService],
})
export class CorsoDiLaureaModule {}