import { Module } from '@nestjs/common';
import { AppelloController } from './appello.controller';
import { AppelloService } from './appello.service';

@Module({
  controllers: [AppelloController],
  providers: [AppelloService],
  exports: [AppelloService],
})
export class AppelloModule {}
