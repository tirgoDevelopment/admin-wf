import { Body, Controller, Post, HttpCode, HttpStatus, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateStaffDto } from 'src/main/staffs/staff.dto';
import { StaffsService } from 'src/main/staffs/staffs.service';

@Controller('api/v2/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: StaffsService
    ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  
  @Post('register')
  @UsePipes(ValidationPipe)
  async createUser(@Body() createStaffDto: CreateStaffDto) {
    return this.usersService.createStaff(createStaffDto);
  }
}