import { IsString, IsOptional, IsInt, IsDate } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UpdateAppelloDto {
    @ApiPropertyOptional({ example: '2025-06-01' })
    @Type(() => Date)
    @IsDate({ message: 'La data non è una data ISO valida' })
    data?: Date;

    @ApiPropertyOptional({ example: 'B3' })
    @IsOptional()
    @IsString()
    aula?: string;

    @ApiPropertyOptional({ example: '14:00:00' })
    @IsOptional()
    @IsString()
    ora?: string;

    @ApiPropertyOptional({ example: 'Portare calcolatrice scientifica' })
    @IsOptional()
    @IsString()
    note?: string;

    @ApiPropertyOptional({ example: 2 })
    @IsOptional()
    @IsInt()
    materiaId?: number;

    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @IsInt()
    sessioneId?: number;
}
