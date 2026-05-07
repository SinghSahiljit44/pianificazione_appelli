// apps/server/src/app/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServerUsersModule } from '@server/users';
import { DatabaseModule } from '@org/database';
import { ServerAuthModule } from '@server/auth';

import { AppelloModule } from '@server/appello'; 
import { DocenteModule } from '@server/docente'; 
import { SessioneModule } from '@server/sessione'; 
import { MateriaModule } from '@server/materia'; 
import { CorsoDiLaureaModule } from '@server/corso-di-laurea'; 


@Module({
  imports: [
    ServerUsersModule, 
    DatabaseModule, 
    ServerAuthModule,
    SessioneModule,
    MateriaModule,
    CorsoDiLaureaModule,
    DocenteModule,
    AppelloModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}