import { IsString, IsOptional, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import type { IUpdateCorsoLaurea } from '@shared/api-types';

export class UpdateCorsoDiLaureaDto implements IUpdateCorsoLaurea {
    @ApiProperty({ required: false, example: 'Ingegneria Informatica' })
    @IsOptional()
    @IsString()
    nome?: string;

    @ApiProperty({ required: false, example: 'Descrizione aggiornata del corso...' })
    @IsOptional()
    @IsString()
    descrizione?: string;

    @ApiProperty({ required: false, example: 3 })
    @IsOptional()
    @IsInt()
    @Min(1)
    durataAnni?: number;
}