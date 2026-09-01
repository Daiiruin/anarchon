import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(/[A-Z]/, { message: 'password must contain at least one uppercase letter' })
  @Matches(/[a-z]/, { message: 'password must contain at least one lowercase letter' })
  @Matches(/\d/, { message: 'password must contain at least one digit' })
  @Matches(/[!"#$%&'()*+,\-./:;<=>?@[\\\]^_{|}`~]/, { message: 'password must contain at least one special character (!@#$%^&*...)' })
  password: string;
}
