import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDocenteDto {
  @ApiProperty({ required: false, example: 'Prof. Ordinario' })
  @IsOptional()
  @IsString()
  titolo?: string;

  @ApiProperty({ required: false, example: 'Matematica e Fisica' })
  @IsOptional()
  @IsString()
  dipartimento?: string;
}
