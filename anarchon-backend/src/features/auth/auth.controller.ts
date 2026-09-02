import {
  Controller,
  Post,
  Body,
  Res,
  UseGuards,
  Req,
  Get,
  UnauthorizedException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshGuard } from './guards/refresh.guard';
import { JwtGuard } from './guards/jwt.guard';

const REFRESH_COOKIE_PATH = '/api/auth';

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'strict' as const,
  secure: process.env.NODE_ENV === 'production',
  path: REFRESH_COOKIE_PATH,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

function extractRefreshToken(req: Request): string {
  const token: unknown = req.cookies?.refresh_token;
  if (typeof token !== 'string') {
    throw new UnauthorizedException();
  }
  return token;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.register(dto);
    res.cookie('refresh_token', tokens.refresh_token, REFRESH_COOKIE_OPTIONS);
    return { access_token: tokens.access_token };
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.login(dto);
    res.cookie('refresh_token', tokens.refresh_token, REFRESH_COOKIE_OPTIONS);
    return { access_token: tokens.access_token };
  }

  @UseGuards(JwtGuard)
  @Get('me')
  async me(@Req() req: Request) {
    const user = req.user as { id: string };
    return this.authService.getProfile(user.id);
  }

  @UseGuards(RefreshGuard)
  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const rawToken = extractRefreshToken(req);
    const tokens = await this.authService.refresh(rawToken);
    res.cookie('refresh_token', tokens.refresh_token, REFRESH_COOKIE_OPTIONS);
    return { access_token: tokens.access_token };
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token: unknown = req.cookies?.refresh_token;
    if (typeof token === 'string') {
      await this.authService.logout(token);
    }
    res.clearCookie('refresh_token', { path: REFRESH_COOKIE_PATH });
    return { success: true };
  }
}
