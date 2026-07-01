import { IsString, IsNotEmpty, IsOptional, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCorsoDiLaureaDto {
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