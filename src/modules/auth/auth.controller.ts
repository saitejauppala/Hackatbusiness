import { Controller, Post, Body, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from '../../common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Public() // Explicitly open for authenticating natively
  @Post('login')
  async login(@Body() loginDto: any) {
    this.logger.log(`Negotiating cryptographic token identity mapping for ${loginDto?.email || 'anonymous'}`);
    return this.authService.login({
      id: loginDto?.id || '123-uuid-456-789-mock',
      email: loginDto?.email || 'user@example.com',
      role: loginDto?.role || 'admin',
    });
  }
}
