import { IsString, IsNotEmpty, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import type { IChangePassword } from '@shared/api-types';

export class ChangePasswordDto implements IChangePassword {
  @ApiProperty({ example: 'Password1!' })
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty({ example: 'Password2!' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
  @Matches(/[?^!#@]/, { message: 'Password must contain at least one symbol among ? ^ ! # @' })
  newPassword: string;
}
