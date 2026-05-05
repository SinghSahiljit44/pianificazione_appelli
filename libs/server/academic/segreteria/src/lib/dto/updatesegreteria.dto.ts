import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSegreteriaDto {
  @ApiProperty({ example: 'Nuovo Ufficio Esterno', required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  ufficio?: string;

  @ApiProperty({ example: '030-999888', required: false })
  @IsOptional()
  @IsString()
  telefonoInterno?: string;
}