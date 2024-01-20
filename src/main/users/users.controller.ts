import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('api/v2/users')
export class UsersController {

    constructor(
        private usersService: UsersService
    ) { }

    @Get('all')
    async getAllUser() {
        return this.usersService.getAllUsers();
    }

}
