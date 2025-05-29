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
    const { email, password_hash, username, first_name, last_name, phone_number, address } = authDto;

    const hashedPassword = await bcrypt.hash(password_hash, 10);

    const user = await this.prismaMysql.users.create({
      data: {
        email,
        password_hash: hashedPassword,
        username,
        first_name,
        last_name,
        phone_number,
        address,
      },
    });

    // const accessToken = this.jwtService.sign({ userId: user.id });
    const accessToken = this.jwtService.signAsync({data: {username: user.username, password: user.password_hash}}, {algorithm: 'HS256', expiresIn: "30m", secret: "BI_MAT"});

    return accessToken;
  }

  async login(authDto: AuthDto): Promise<string> {
    const { email, password_hash } = authDto;
    const user = await this.prismaMysql.users.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password_hash, user.password_hash))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = this.jwtService.signAsync({data: {userId: user.user_id}}, {algorithm: 'HS256', expiresIn: "30m", secret: "BI_MAT"});

    return accessToken;
  }
}
