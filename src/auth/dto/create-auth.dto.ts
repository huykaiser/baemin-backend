import { ApiProperty } from "@nestjs/swagger";

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}

export class AuthDto {
  @ApiProperty({ name: "email", type: 'string', description: 'User email address (must be unique)' })
  email: string;

  @ApiProperty({ name: "password", type: 'string', description: 'User password' })
  password: string;

  @ApiProperty({ name: "username", type: 'string', description: 'Username' })
  username: string;

  @ApiProperty({ name: "name", type: 'string', description: 'Full name' })
  name: string;

  @ApiProperty({ name: "phone", type: 'string', description: 'Phone number' })
  phone: string;

  @ApiProperty({ name: "address", type: 'string', required: false, description: 'User address (optional)' })
  address?: string;

  @ApiProperty({ 
    name: "role", 
    enum: UserRole, 
    default: UserRole.USER, 
    required: false, 
    description: 'User role (defaults to user)' 
  })
  role?: UserRole;
}