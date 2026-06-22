import { IsString, IsNotEmpty, IsOptional, IsInt, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import type { ICreateAppello } from '@shared/api-types';

export class CreateAppelloDto implements ICreateAppello {
    @ApiProperty({ example: '2025-06-15' })
    @IsDateString({}, { message: 'La data non è una data ISO valida' })
    data: string;

    @ApiProperty({ example: '09:30:00' })
    @IsString()
    @IsNotEmpty()
    ora: string;

    @ApiProperty({ example: 'A1' })
    @IsString()
    @IsNotEmpty()
    aula: string;

    @ApiProperty({ required: false, example: 'Portare calcolatrice' })
    @IsOptional()
    @IsString()
    note?: string;

    @ApiProperty({ example: 1 })
    @IsInt()
    materiaId: number;

    @ApiProperty({ example: 1 })
    @IsInt()
    sessioneId: number;
}
