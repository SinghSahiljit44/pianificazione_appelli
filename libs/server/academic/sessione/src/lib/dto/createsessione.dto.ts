import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDate } from 'class-validator';
import { Transform } from 'class-transformer';

const toValidDate = ({ value }: { value: unknown }) => {
  if (typeof value !== 'string') return value;
  const date = new Date(value);
  if (isNaN(date.getTime())) return new Date(NaN);
  const [y, m, d] = value.split('-').map(Number);
  return date.getFullYear() === y && date.getMonth() + 1 === m && date.getDate() === d ? date : new Date(NaN);
};

export class CreateSessioneDto {
  @ApiProperty({ example: 'Sessione Estiva 2025' })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({ example: '2025-06-01' })
  @Transform(toValidDate)
  @IsDate({ message: 'La data non esiste nel calendario' })
  dataInizio: Date;

  @ApiProperty({ example: '2025-07-31' })
  @Transform(toValidDate)
  @IsDate({ message: 'La data non esiste nel calendario' })
  dataFine: Date;

  @ApiProperty({ example: '2025-05-01' })
  @Transform(toValidDate)
  @IsDate({ message: 'La data non esiste nel calendario' })
  dataInizioInserimento: Date;

  @ApiProperty({ example: '2025-05-31' })
  @Transform(toValidDate)
  @IsDate({ message: 'La data non esiste nel calendario' })
  dataFineInserimento: Date;
}
