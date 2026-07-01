import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsDate } from 'class-validator';

export class CreateSessioneDto {
  @ApiProperty({ example: 'Sessione Estiva 2025' })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({ example: '2025-06-01' })
  @Type(() => Date)
  @IsDate({ message: 'La data non è una data ISO valida' })
  dataInizio: Date;

  @ApiProperty({ example: '2025-07-31' })
  @Type(() => Date)
  @IsDate({ message: 'La data non è una data ISO valida' })
  dataFine: Date;

  @ApiProperty({ example: '2025-05-01' })
  @Type(() => Date)
  @IsDate({ message: 'La data non è una data ISO valida' })
  dataInizioInserimento: Date;
  
  @ApiProperty({ type: String, format: 'date-time', example: '2026-05-31T23:59:59.000Z' })
  @Type(() => Date)
  @IsDate({ message: 'La data inserita non è valida' })
  dataFineInserimento: Date;
}
