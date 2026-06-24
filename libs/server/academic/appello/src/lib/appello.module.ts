import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppelloEntity } from '@server/academic-entities';
import { AppelloService } from './appello.service';
import { AppelloController } from './appello.controller';
import { AppelloRepository } from './appello.repository';
import { SessioneModule } from '@server/sessione';
import { MateriaModule } from '@server/materia';
import { DocenteModule } from '@server/docente';

@Module({
  imports: [
    TypeOrmModule.forFeature([AppelloEntity]),
    SessioneModule,
    MateriaModule,
    DocenteModule,
  ],
  controllers: [AppelloController],
  providers: [AppelloService, AppelloRepository],
  exports: [AppelloService],
})
export class AppelloModule {}
