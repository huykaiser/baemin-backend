import { Controller, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private jwtService: JwtService
  ) {}

  @Post('login')
  login() {
    // B0: kiểm tra token có tồn tại trên hệ thống (cookies, session, localStorage)
    // -> verify token -> trả về lỗi token expired -> kiểm tra refresh token

    // B1: xác thực bằng cách kiểm tra username và password (abc1234) -> mã hoá password
    // ...

    // B2: tạo token data cho người dùng
    const token = this.jwtService.signAsync({data: {username: "duy123", password: "abcd1234"}}, {algorithm: 'HS256', expiresIn: "5m", secret: "BI_MAT"})

    return token

    // this.jwtService.verify("...")

  }

  @Post('verify')
  verify(@Query('token') token: string) {
    // B1: xác thực bằng cách kiểm tra username và password (abc1234) -> mã hoá password
    // ...

    return this.jwtService.verify(token, {secret: "BI_MAT"})

    // this.jwtService.verify("...")

  }
}