import { Body, Controller, Get, Param, ParseIntPipe, Post, UnauthorizedException } from '@nestjs/common';
import { UserType } from '@prisma/client';
import { Roles } from 'src/decorators/role.decorator';
import { User, UserInfo } from 'src/user/decorators/user.decorator';
import { InquireDto } from './dtos/messagedtos';
import { MessageService } from './message.service';
import { HomeService } from 'src/home/home.service';

@Controller('message')
export class MessageController {
    constructor(private readonly messageService:MessageService, private readonly homeService:HomeService){}
    @Roles(UserType.BUYER)
    @Post("/:id/inquire")
    inquire(@User() buyer:UserInfo, @Param("id", ParseIntPipe) homeId:number, @Body() body:InquireDto){
        const message = body.message
        return this.messageService.inquire(buyer, homeId, message)
    }

    @Roles(UserType.REALTOR)
    @Get("/:id/messages")
    async getHomeMessages(@Param("id", ParseIntPipe) homedId:number, @User() realtor:UserInfo){
        const result = await this.homeService.getRealtorByHomeId(homedId)
        if(result.realtor.id !== realtor.id){
            throw new UnauthorizedException()
        }
return this.messageService.getHomeMessages(realtor, homedId)
    }
}
