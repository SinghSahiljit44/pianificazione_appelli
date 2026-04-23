import { Module } from '@nestjs/common';
import { SessioneController } from './sessione.controller';
import { SessioneService } from './sessione.service';

@Module({
  controllers: [SessioneController],
  providers: [SessioneService],
  exports: [SessioneService],
})
export class SessioneModule {}
