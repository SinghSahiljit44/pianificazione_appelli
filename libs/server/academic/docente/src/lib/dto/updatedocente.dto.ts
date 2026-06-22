import { IsString, IsOptional, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import type { IUpdateDocente } from '@shared/api-types';

export class UpdateDocenteDto implements IUpdateDocente {
    @ApiProperty({ required: false, example: 'Prof. Ordinario' })
    @IsOptional()
    @IsString()
    titolo?: string;

    @ApiProperty({ required: false, example: 'Matematica e Fisica' })
    @IsOptional()
    @IsString()
    dipartimento?: string;

}