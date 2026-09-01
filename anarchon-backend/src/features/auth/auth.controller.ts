import { Controller, Post, Body, Res, UseGuards, Req, Get } from "@nestjs/common";
import { Response, Request } from "express";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { RefreshGuard } from "./guards/refresh.guard";
import { JwtGuard } from "./guards/jwt.guard";

const REFRESH_COOKIE_OPTIONS = {
    httpOnly: true,
    sameSite: "strict" as const,
    maxAge: 7 * 24 * 60 * 60 * 1000,
};

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("register")
    async register(
        @Body() dto: RegisterDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const tokens = await this.authService.register(dto);
        res.cookie(
            "refresh_token",
            tokens.refresh_token,
            REFRESH_COOKIE_OPTIONS,
        );
        return { access_token: tokens.access_token };
    }

    @Post("login")
    async login(
        @Body() dto: LoginDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const tokens = await this.authService.login(dto);
        res.cookie(
            "refresh_token",
            tokens.refresh_token,
            REFRESH_COOKIE_OPTIONS,
        );
        return { access_token: tokens.access_token };
    }

    @UseGuards(JwtGuard)
    @Get("me")
    me(@Req() req: Request) {
        return req.user;
    }

    @UseGuards(RefreshGuard)
    @Post("refresh")
    async refresh(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        const user = req.user as { id: string; email: string };
        const tokens = await this.authService.refresh(user.id);
        res.cookie(
            "refresh_token",
            tokens.refresh_token,
            REFRESH_COOKIE_OPTIONS,
        );
        return { access_token: tokens.access_token };
    }
}
