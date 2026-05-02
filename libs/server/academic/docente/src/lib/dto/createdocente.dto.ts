import { IsString, IsNotEmpty, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDocenteDto {
    @ApiProperty({ example: 'Prof. Associato' })
    @IsString()
    @IsNotEmpty()
    titolo: string;

    @ApiProperty({ example: 'Ingegneria Informatica' })
    @IsString()
    @IsNotEmpty()
    dipartimento: string;

    @ApiProperty({ example: 1})
    @IsInt()
    @IsNotEmpty()
    userId: number;
}