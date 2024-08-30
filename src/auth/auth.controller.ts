import { Body, Controller, Patch, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Response, Request } from 'express';
import { Public } from 'src/utils/PublicDecorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post()
  login(@Body() data: LoginDto) {
    return this.authService.login(data);
  }

  @Patch('logout')
  logout(@Req() req: Request, @Res() res: Response) {
    res.clearCookie('token');
    return res.status(200).json({ message: 'Logout bem-sucedido' });
  }

  @Patch('refresh-token')
  refreshToken(@Body('token') token: string) {
    return this.authService.refreshToken(token);
  }
}
