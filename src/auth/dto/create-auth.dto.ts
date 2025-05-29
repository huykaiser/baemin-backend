import { ApiProperty } from "@nestjs/swagger";

export class AuthDto {
  @ApiProperty({ name: "email", type: 'string' })
  email: string;

  @ApiProperty({ name: "password", type: 'string' })
  password: string;

  @ApiProperty({ name: "username", type: 'string' })
  username: string;

  @ApiProperty({ name: "name", type: 'string' })
  name: string;

  @ApiProperty({ name: "phone", type: 'string' })
  phone: string;

  @ApiProperty({ name: "address", type: 'string' })
  address: string;
}