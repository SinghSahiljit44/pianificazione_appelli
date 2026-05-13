import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateSessioneDto {
  @ApiPropertyOptional({ example: 'Sessione Estiva 2025 (Aggiornata)' })
  @IsOptional()
  @IsString()
  nome?: string;

  @ApiPropertyOptional({ example: '2025-06-01' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dataInizio?: Date;

  @ApiPropertyOptional({ example: '2025-07-31' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dataFine?: Date;

  @ApiPropertyOptional({ example: '2025-05-01' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dataInizioInserimento?: Date;

  @ApiPropertyOptional({ example: '2025-05-31' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dataFineInserimento?: Date;
}