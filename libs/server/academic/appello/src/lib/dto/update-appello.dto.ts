import { IsString, IsOptional, IsInt, IsDate } from 'class-validator';
import { Transform } from 'class-transformer';

const toValidDate = ({ value }: { value: unknown }) => {
  if (typeof value !== 'string') return value;
  const date = new Date(value);
  if (isNaN(date.getTime())) return new Date(NaN);
  const [y, m, d] = value.split('-').map(Number);
  return date.getFullYear() === y && date.getMonth() + 1 === m && date.getDate() === d ? date : new Date(NaN);
};

export class UpdateAppelloDto {
    @IsOptional()
    @Transform(toValidDate)
    @IsDate({ message: 'La data non esiste nel calendario' })
    data?: Date;

    @IsOptional()
    @IsString()
    aula?: string;

    @IsOptional()
    @IsString()
    ora?: string;

    @IsOptional()
    @IsString()
    note?: string;

    @IsOptional()
    @IsInt()
    materiaId?: number;

    @IsOptional()
    @IsInt()
    sessioneId?: number;
}
