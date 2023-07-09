import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from "jsonwebtoken"
import { PrismaService } from 'src/prisma/prisma.service';
import { UserInfo } from 'src/user/decorators/user.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly prismaService:PrismaService) {}

  async canActivate(context: ExecutionContext) {
    const roles = this.reflector.getAllAndOverride('roles', [
      context.getHandler(),
    ]);
    console.log({roles})

    if(roles){
        const request = context.switchToHttp().getRequest();
        const token = request?.headers?.authorization?.split(" ")[1]
        try {
          const user = await jwt.verify(token, process.env.JSON_TOKEN_KEY) as UserInfo
          const dbUser = await this.prismaService.user.findUnique({where:{id:user.id}})
          console.log({user})
          if(!user) return false
          if(roles.includes(dbUser.user_type)) return true
          return false
        } catch (error) {
            return false
        }

    }

    console.log({ roles });

    return true;
  }
}
