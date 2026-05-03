import { IsString, IsNotEmpty, IsOptional, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSegreteriaDto {
  @ApiProperty({ example: 'Ufficio Didattica' })
  @IsString()
  @IsNotEmpty()
  ufficio: string;

  @ApiProperty({ example: '0321', required: false })
  @IsOptional()
  @IsString()
  telefonoInterno?: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  userId: number;
}