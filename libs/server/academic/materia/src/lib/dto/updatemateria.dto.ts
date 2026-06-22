import { IsString, IsInt, IsOptional, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CorsoAnnoDto } from './createmateria.dto';
import type { IUpdateMateria } from '@shared/api-types';

export class UpdateMateriaDto implements IUpdateMateria {
  @ApiProperty({ required: false, example: 'Analisi Matematica I' })
  @IsOptional()
  @IsString()
  nome?: string;

  @ApiProperty({ required: false, example: 6 })
  @IsOptional()
  @IsInt()
  @Min(1)
  cfu?: number;

  @ApiProperty({ required: false, example: 1 })
  @IsOptional()
  @IsInt()
  docenteId?: number;

  @ApiProperty({ required: false, type: [CorsoAnnoDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CorsoAnnoDto)
  corsi?: CorsoAnnoDto[];
}