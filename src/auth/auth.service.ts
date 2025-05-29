import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaMysqlService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
    constructor(
        public prismaMysql: PrismaMysqlService,
        public jwtService: JwtService
    ) {}

    async signUp(authDto: AuthDto): Promise<string> {
    const { email, password, username, name, phone, address } = authDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prismaMysql.users.create({
      data: {
        email,
        password: hashedPassword,
        username,
        name,
        phone,
        address,
      },
    });

    // const accessToken = this.jwtService.sign({ userId: user.id });
    const accessToken = this.jwtService.signAsync({data: {username: user.username, password: user.password}}, {algorithm: 'HS256', expiresIn: "30m", secret: "BI_MAT"});

    return accessToken;
  }

  async login(authDto: AuthDto): Promise<string> {
    const { email, password } = authDto;
    const user = await this.prismaMysql.users.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = this.jwtService.signAsync({data: {userId: user.id}}, {algorithm: 'HS256', expiresIn: "30m", secret: "BI_MAT"});

    return accessToken;
  }
}
