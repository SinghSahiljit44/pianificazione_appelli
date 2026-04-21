import { Module } from '@nestjs/common';
import { OrgCorsoDiLaureaController } from './corso-di-laurea.controller';
import { OrgCorsoDiLaureaService } from './corso-di-laurea.service';

@Module({
  controllers: [OrgCorsoDiLaureaController],
  providers: [OrgCorsoDiLaureaService],
  exports: [OrgCorsoDiLaureaService],
})
export class OrgCorsoDiLaureaModule {}
