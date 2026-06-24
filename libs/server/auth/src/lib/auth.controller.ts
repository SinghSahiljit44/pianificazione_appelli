import {
  Controller,
  UseGuards,
  Post,
  Patch,
  Request,
  Body,
  ValidationPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { ServerAuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import type { AuthenticatedUser } from './interfaces/authenticated-user.interface';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { UserRole } from '@server/users';
import { JwtAuthGuard, RolesGuard, Roles, CurrentUser } from '@server/security';

type RequestWithUser = Request & {
  user: AuthenticatedUser;
};

@ApiTags('Auth APIs')
@Controller('auth')
export class ServerAuthController {
  constructor(private serverAuthService: ServerAuthService) {}

  //Guarda guards
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'devis.bianchini@unibs.it' },
        password: { type: 'string', example: 'Password1!' },
      },
      required: ['email', 'password'],
    },
  })
  login(@Request() req: RequestWithUser) {
    return this.serverAuthService.login(req.user);
  }

  @Post('register')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Devis' },
        email: { type: 'string', example: 'devis.bianchini@unibs.it' },
        password: { type: 'string', example: 'Password1!' },
        role: {
          type: 'string',
          enum: Object.values(UserRole),
          example: UserRole.USER,
        },
      },
      required: ['name', 'email', 'password', 'role'],
    },
  })
  register(@Body(ValidationPipe) dto: RegisterDto) {
    return this.serverAuthService.register(dto);
  }

  @Patch('password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        currentPassword: { type: 'string', example: 'Password1!' },
        newPassword: { type: 'string', example: 'Password2!' },
      },
      required: ['currentPassword', 'newPassword'],
    },
  })
  changePassword(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ValidationPipe({ whitelist: true })) dto: ChangePasswordDto,
  ) {
    return this.serverAuthService.changePassword(user.id, dto);
  }
}
