import { IsString, IsOptional, IsInt, IsDate } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

const toValidDate = ({ value }: { value: unknown }) => {
  if (typeof value !== 'string') return value;
  const date = new Date(value);
  if (isNaN(date.getTime())) return new Date(NaN);
  const [y, m, d] = value.split('-').map(Number);
  return date.getFullYear() === y && date.getMonth() + 1 === m && date.getDate() === d ? date : new Date(NaN);
};

export class UpdateAppelloDto {
    @ApiPropertyOptional({ example: '2025-06-20' })
    @IsOptional()
    @Transform(toValidDate)
    @IsDate({ message: 'La data non esiste nel calendario' })
    data?: Date;

    @ApiPropertyOptional({ example: 'B3' })
    @IsOptional()
    @IsString()
    aula?: string;

    @ApiPropertyOptional({ example: '14:00:00' })
    @IsOptional()
    @IsString()
    ora?: string;

    @ApiPropertyOptional({ example: 'Portare calcolatrice scientifica' })
    @IsOptional()
    @IsString()
    note?: string;

    @ApiPropertyOptional({ example: 2 })
    @IsOptional()
    @IsInt()
    materiaId?: number;

    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @IsInt()
    sessioneId?: number;
}
