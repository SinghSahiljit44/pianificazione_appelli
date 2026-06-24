import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessioneEntity } from '@server/academic-entities';
import { SessioneService } from './sessione.service';
import { SessioneController } from './sessione.controller';
import { SessioneRepository } from './sessione.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SessioneEntity])],
  controllers: [SessioneController],
  providers: [SessioneService, SessioneRepository],
  exports: [SessioneService],
})
export class SessioneModule {}
