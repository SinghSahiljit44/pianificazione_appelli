import { IsString, IsNotEmpty, IsOptional, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import type { ICreateCorsoLaurea } from '@shared/api-types';

export class CreateCorsoDiLaureaDto implements ICreateCorsoLaurea {
    @ApiProperty({ example: 'Ingegneria Informatica' })
    @IsString()
    @IsNotEmpty()
    nome: string;

    @ApiProperty({ required: false, example: 'Descrizione del corso...' })
    @IsOptional()
    @IsString()
    descrizione?: string;

    @ApiProperty({ example: 3 })
    @IsOptional()
    @IsInt()
    @Min(1)
    durataAnni?: number;
}