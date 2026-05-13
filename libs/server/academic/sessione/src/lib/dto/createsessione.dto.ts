import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSessioneDto {
  @ApiProperty({ example: 'Sessione Estiva 2025' })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({ example: '2025-06-01' })
  @Type(() => Date)
  @IsDate()
  dataInizio: Date;

  @ApiProperty({ example: '2025-07-31' })
  @Type(() => Date)
  @IsDate()
  dataFine: Date;

  @ApiProperty({ example: '2025-05-01' })
  @Type(() => Date)
  @IsDate()
  dataInizioInserimento: Date;

  @ApiProperty({ example: '2025-05-31' })
  @Type(() => Date)
  @IsDate()
  dataFineInserimento: Date;
}