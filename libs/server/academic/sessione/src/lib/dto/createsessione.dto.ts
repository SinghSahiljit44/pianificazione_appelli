import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDateString } from 'class-validator';
import type { ICreateSessione } from '@shared/api-types';

export class CreateSessioneDto implements ICreateSessione {
  @ApiProperty({ example: 'Sessione Estiva 2025' })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({ example: '2025-06-01' })
  @IsDateString({}, { message: 'La data non è una data ISO valida' })
  dataInizio: string;

  @ApiProperty({ example: '2025-07-31' })
  @IsDateString({}, { message: 'La data non è una data ISO valida' })
  dataFine: string;

  @ApiProperty({ example: '2025-05-01' })
  @IsDateString({}, { message: 'La data non è una data ISO valida' })
  dataInizioInserimento: string;

  @ApiProperty({ example: '2025-05-31' })
  @IsDateString({}, { message: 'La data non è una data ISO valida' })
  dataFineInserimento: string;
}
