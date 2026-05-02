import { IsString, IsNotEmpty, IsOptional, IsInt, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAppelloDto {
    @ApiProperty({ example: '2025-06-15' })
    @IsDateString() // Controlla che sia una stringa in formato data valido
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
    @IsOptional() // Dice alla Pipe che questo campo può mancare
    @IsString()
    note?: string;

    @ApiProperty({ example: 1 })
    @IsInt() // Controlla che sia un numero intero
    materiaId: number;

    @ApiProperty({ example: 1 })
    @IsInt()
    sessioneId: number;
}