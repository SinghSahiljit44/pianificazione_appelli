// apps/server/src/app/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServerUsersModule } from '@server/users';
import { OrgBooksModule } from '@org/books';
import { DatabaseModule } from '@org/database';
import { ServerAuthModule } from '@server/auth';

import { AppelloModule } from '@server/appello'; 
import { DocenteModule } from '@server/docente'; 
import { SessioneModule } from '@server/sessione'; 
import { SegreteriaModule } from '@server/segreteria'; 
import { MateriaModule } from '@server/materia'; 
import { CorsoDiLaureaModule } from '@server/corso-di-laurea'; 


@Module({
  imports: [
    ServerUsersModule, 
    OrgBooksModule, 
    DatabaseModule, 
    ServerAuthModule,
    SessioneModule,
    MateriaModule,
    CorsoDiLaureaModule,
    SegreteriaModule,
    DocenteModule,
    AppelloModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}