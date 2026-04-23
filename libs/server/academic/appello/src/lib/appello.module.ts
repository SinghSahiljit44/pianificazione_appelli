import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppelloEntity } from './appello.entity';
import { AppelloService } from './appello.service';
import { AppelloController } from './appello.controller';
import { AppelloRepository } from './appello.repository';

@Module({
  imports: [TypeOrmModule.forFeature([AppelloEntity])],
  controllers: [AppelloController],
  providers: [AppelloService, AppelloRepository],
  exports: [AppelloService],
})
export class AppelloModule {}