import { IsNotEmpty, IsEmail, MinLength, IsString } from "class-validator";

export class RegisterDto {

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsString()
  name:string;
}