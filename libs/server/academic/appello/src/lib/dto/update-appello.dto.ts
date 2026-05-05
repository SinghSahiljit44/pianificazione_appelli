import { IsString, IsOptional, IsInt, IsDateString } from 'class-validator';

export class UpdateAppelloDto {
    @IsOptional()
    @IsDateString()
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