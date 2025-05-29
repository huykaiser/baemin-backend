import { ApiProperty } from "@nestjs/swagger";

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}

export class AuthDto {
  @ApiProperty({ name: "email", type: 'string', description: 'User email address (must be unique)' })
  email: string;

  @ApiProperty({ name: "password_hash", type: 'string', description: 'User password' })
  password_hash: string;

  @ApiProperty({ name: "username", type: 'string', description: 'Username' })
  username: string;

  @ApiProperty({ name: "first_name", type: 'string', description: 'first name' })
  first_name: string;

  @ApiProperty({ name: "last_name", type: 'string', description: 'last name' })
  last_name: string;

  @ApiProperty({ name: "phone_number", type: 'string', description: 'Phone number' })
  phone_number: string;

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