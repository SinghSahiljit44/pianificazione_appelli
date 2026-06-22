import { IsString, IsNotEmpty, IsInt, IsOptional, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import type { ICreateMateria } from '@shared/api-types';

export class CorsoAnnoDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  corsoId: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  anno: number;
}

export class CreateMateriaDto implements ICreateMateria {
  @ApiProperty({ example: 'Analisi Matematica I' })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({ example: 9 })
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  cfu: number;

  @ApiProperty({ required: false, example: 1 })
  @IsOptional()
  @IsInt()
  docenteId?: number;

  @ApiProperty({ type: [CorsoAnnoDto] })
  @IsArray()
  @ValidateNested({ each: true }) 
  @Type(() => CorsoAnnoDto)       
  corsi: CorsoAnnoDto[];
}