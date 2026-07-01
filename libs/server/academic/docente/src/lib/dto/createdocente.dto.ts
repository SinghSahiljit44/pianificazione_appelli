import { IsString, IsNotEmpty, IsEmail, MinLength, Matches } from 'class-validator';
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

  @ApiProperty({ example: 'Mario Rossi' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'mario.rossi@universita.it' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Password1!' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
  @Matches(/[?^!#@]/, { message: 'Password must contain at least one symbol among ? ^ ! # @' })
  password: string;
}
