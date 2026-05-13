import { IsString, IsOptional, IsInt, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateAppelloDto {
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    data?: Date;

    @IsOptional()
    @IsString()
    aula?: string;

    @IsOptional()
    @IsString()
    ora?: string;

    @IsOptional()
    @IsString()
    note?: string;

    @IsOptional()
    @IsInt()
    materiaId?: number;

    @IsOptional()
    @IsInt()
    sessioneId?: number;
}