import { IsString, IsNotEmpty, IsOptional, IsInt, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAppelloDto {
    @ApiProperty({ example: '2025-06-15' })
    @Type(() => Date)
    @IsDate({ message: 'La data non esiste nel calendario' })
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
