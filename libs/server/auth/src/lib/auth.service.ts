import { NotFoundException, Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { ServerUsersService } from '@server/users';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthenticatedUser } from './interfaces/authenticated-user.interface';
import { AuthResponse } from './interfaces/auth-response.interface';
import { RegisterDto } from './dto/register.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class ServerAuthService {
    // Injecting the used services
    constructor(private readonly usersService: ServerUsersService,
        private readonly jwtService: JwtService) {}

    async validateUser(email: string, password: string): Promise<AuthenticatedUser> {
        const user = await this.usersService.findByEmail(email);

        if(!user) throw new NotFoundException("Credentials not valid");

        const passwordMatches = await bcrypt.compare(password,user.passwordHash);
        if(!passwordMatches) {
            throw new UnauthorizedException("Credentials not valid!");
        }

        const { passwordHash, ...result } = user;
        return result;
    }

    async login(user: AuthenticatedUser): Promise<AuthResponse> {
        const payload = {sub: user.id, name: user.name, email: user.email, role: user.role};
        return {access_token: await this.jwtService.signAsync(payload), user}
    }

    //Al posto di AuthResponse se metto any => qualsiasi cosa
    async register(dto: RegisterDto): Promise<AuthResponse> {
        const user = await this.usersService.create(dto);

        //tutto tranne password hash
        const { passwordHash, ...result } = user;
        return this.login(result);
    }

    async changePassword(userId: number, dto: ChangePasswordDto): Promise<void> {
        const user = await this.usersService.getOneUser(userId);

        const currentMatches = await bcrypt.compare(dto.currentPassword, user.passwordHash);
        if (!currentMatches) {
            throw new UnauthorizedException('La password attuale non è corretta');
        }

        if (dto.currentPassword === dto.newPassword) {
            throw new BadRequestException('La nuova password deve essere diversa da quella attuale');
        }

        await this.usersService.updatePassword(userId, dto.newPassword);
    }
}

