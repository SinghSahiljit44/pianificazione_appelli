import { Module } from '@nestjs/common';
import { OrgAppelloController } from './appello.controller';
import { OrgAppelloService } from './appello.service';

@Module({
  controllers: [OrgAppelloController],
  providers: [OrgAppelloService],
  exports: [OrgAppelloService],
})
export class OrgAppelloModule {}
