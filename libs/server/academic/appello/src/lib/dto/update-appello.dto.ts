import { IsString, IsOptional, IsInt, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAppelloDto {
    @ApiPropertyOptional({ example: '2025-06-20' })
    @IsOptional()
    @Type(() => Date)
    @IsDate({ message: 'La data non esiste nel calendario' })
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
