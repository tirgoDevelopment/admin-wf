import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BpmResponse, ResponseStauses } from 'src/main/index';
import { StaffsService } from 'src/main/staffs/staffs.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: StaffsService,
    private jwtService: JwtService
  ) {}

  async signIn(username, pass) {
    const user = await this.usersService.findByUsername(username);
    if(!user) {
        return new BpmResponse(false, null, [ResponseStauses.NotFound]);
    }
    if (user?.password !== pass) {
        return new BpmResponse(false, null, [ResponseStauses.InvalidPassword]);
    }
    const payload = { sub: user.id, username: user.username };
    return new BpmResponse(true, { access_token: await this.jwtService.signAsync(payload) });
  }
}