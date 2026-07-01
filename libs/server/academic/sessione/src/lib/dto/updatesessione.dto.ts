import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateSessioneDto {
  @ApiPropertyOptional({ example: 'Sessione Estiva 2025 (Aggiornata)' })
  @IsOptional()
  @IsString()
  nome?: string;

  @ApiPropertyOptional({ example: '2025-06-01' })
  @IsOptional()
  @IsDateString({}, { message: 'La data non è una data ISO valida' })
  dataInizio?: Date;

  @ApiPropertyOptional({ example: '2025-06-01' })
  @Type(() => Date)
  @IsDate({ message: 'La data non è una data ISO valida' })
  dataFine?: Date;
  
  @ApiPropertyOptional({ example: '2025-06-01' })
  @Type(() => Date)
  @IsDate({ message: 'La data non è una data ISO valida' })
  dataInizioInserimento?: Date;

  @ApiPropertyOptional({ example: '2025-06-01' })
  @Type(() => Date)
  @IsDate({ message: 'La data non è una data ISO valida' })
  dataFineInserimento?: Date;
}
