import { IsString, IsOptional, IsInt, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import type { IUpdateAppello } from '@shared/api-types';

export class UpdateAppelloDto implements IUpdateAppello {
    @ApiPropertyOptional({ example: '2025-06-20' })
    @IsOptional()
    @IsDateString({}, { message: 'La data non è una data ISO valida' })
    data?: string;

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
