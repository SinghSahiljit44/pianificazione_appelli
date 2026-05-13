import { IsString, IsNotEmpty, IsOptional, IsInt, IsDate } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

const toValidDate = ({ value }: { value: unknown }) => {
  if (typeof value !== 'string') return value;
  const date = new Date(value);
  if (isNaN(date.getTime())) return new Date(NaN);
  const [y, m, d] = value.split('-').map(Number);
  return date.getFullYear() === y && date.getMonth() + 1 === m && date.getDate() === d ? date : new Date(NaN);
};

export class CreateAppelloDto {
    @ApiProperty({ example: '2025-06-15' })
    @Transform(toValidDate)
    @IsDate({ message: 'La data non esiste nel calendario' })
    data: Date;

    @ApiProperty({ example: '09:30:00' })
    @IsString()
    @IsNotEmpty()
    ora: string;

    @ApiProperty({ example: 'A1' })
    @IsString()
    @IsNotEmpty()
    aula: string;

    @ApiProperty({ required: false, example: 'Portare calcolatrice' })
    @IsOptional()
    @IsString()
    note?: string;

    @ApiProperty({ example: 1 })
    @IsInt()
    materiaId: number;

    @ApiProperty({ example: 1 })
    @IsInt()
    sessioneId: number;
}
