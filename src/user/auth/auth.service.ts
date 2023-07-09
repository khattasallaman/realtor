import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { UserType } from '@prisma/client';
import * as jwt from 'jsonwebtoken';

interface SignupParams {
  email: string;
  password: string;
  name: string;
  phone: string;
}

interface SigninParams {
  email: string;
  password: string;
}

interface GenerateProductKey { 
  email: string;
  userType:UserType

}


@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  async signup({ name, email, password, phone }: SignupParams, userType:UserType) {
    const userExists = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
    if (userExists) {
      throw new ConflictException();
    }

    const hashedPass = await bcrypt.hash(password, 10);

    console.log({ hashedPass });

    const user = await this.prismaService.user.create({
      data: {
        name,
        email,
        password: hashedPass,
        phone,
        user_type: userType,
      },
    });

    return this.generateJwt(name, user.id);
  }

  async signin({ email, password }: SigninParams) {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new HttpException('Invalid credentials', 400);
    }

    const hashedPassword = user.password;

    const isValidPass = await bcrypt.compare(password, hashedPassword);

    if (!isValidPass) {
      throw new HttpException('Invalid credentials', 400);
    }

    return this.generateJwt(user.name, user.id);
  }

  private async generateJwt(name: string, id: number) {
    const token = await jwt.sign(
      {
        name,
        id,
      },
      process.env.JSON_TOKEN_KEY,
      { expiresIn: 556578 },
    );

    return token;
  }

  generateProductKey({email, userType}:GenerateProductKey){
    const token = `${email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`
    return bcrypt.hash(token, 10)
  }
}
