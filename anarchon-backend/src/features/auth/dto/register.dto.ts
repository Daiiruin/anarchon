import { IsEmail, IsEnum, IsString, Matches, MinLength } from 'class-validator';
import { Gender } from '../../users/enums/gender.enum';

export class RegisterDto {
  @IsEmail()
  declare email: string;

  @IsString()
  @MinLength(2)
  declare name: string;

  @IsEnum(Gender)
  declare gender: Gender;

  @IsString()
  @MinLength(8)
  @Matches(/[A-Z]/, {
    message: 'password must contain at least one uppercase letter',
  })
  @Matches(/[a-z]/, {
    message: 'password must contain at least one lowercase letter',
  })
  @Matches(/\d/, { message: 'password must contain at least one digit' })
  @Matches(/[!"#$%&'()*+,\-./:;<=>?@[\\\]^_{|}`~]/, {
    message:
      'password must contain at least one special character (!@#$%^&*...)',
  })
  declare password: string;
}
