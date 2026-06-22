import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString } from 'class-validator';
import type { IUpdateSessione } from '@shared/api-types';

export class UpdateSessioneDto implements IUpdateSessione {
  @ApiPropertyOptional({ example: 'Sessione Estiva 2025 (Aggiornata)' })
  @IsOptional()
  @IsString()
  nome?: string;

  @ApiPropertyOptional({ example: '2025-06-01' })
  @IsOptional()
  @IsDateString({}, { message: 'La data non è una data ISO valida' })
  dataInizio?: string;

  @ApiPropertyOptional({ example: '2025-07-31' })
  @IsOptional()
  @IsDateString({}, { message: 'La data non è una data ISO valida' })
  dataFine?: string;

  @ApiPropertyOptional({ example: '2025-05-01' })
  @IsOptional()
  @IsDateString({}, { message: 'La data non è una data ISO valida' })
  dataInizioInserimento?: string;

  @ApiPropertyOptional({ example: '2025-05-31' })
  @IsOptional()
  @IsDateString({}, { message: 'La data non è una data ISO valida' })
  dataFineInserimento?: string;
}
