import { Body, Controller, Param, ParseEnumPipe, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GenerateProductKey, SigninDto, SignupDto } from '../dtos/auth.dtos';
import { UserType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup/:userType')
  async signup(@Body() body: SignupDto, @Param("userType", new ParseEnumPipe(UserType)) userType:UserType) {
    if( userType !== UserType.BUYER){
        if(!body.productKey){
            throw new UnauthorizedException()
        }

        const token = `${body.email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`

        const isValidKey = await bcrypt.compare(token, body.productKey)

        if(!isValidKey){
            throw new UnauthorizedException()
        }
    }
    return this.authService.signup(body, userType);
  }

  @Post('/signin')
  signin(@Body() body: SigninDto) {
    return this.authService.signin(body);
  }

  @Post("/key")
  generateProductKey(@Body() body:GenerateProductKey){
    return this.authService.generateProductKey(body)
}
  
}
