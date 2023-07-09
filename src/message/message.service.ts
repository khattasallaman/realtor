import { ConflictException, Injectable } from '@nestjs/common';
import { HomeService } from 'src/home/home.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserInfo } from 'src/user/decorators/user.decorator';

@Injectable()
export class MessageService {
    constructor(private readonly prismaService: PrismaService, private readonly homeService:HomeService){}

    async inquire(buyer:UserInfo, homeId:number, message:string){
        const result = await this.homeService.getRealtorByHomeId(homeId)
        console.log({result})


        const newMessage = await this.prismaService.message.create({data:{
            realtor_id: result.realtor.id,
            buyer_id:buyer.id,
            home_id:homeId, message
        }})
        return newMessage
    }

    async getHomeMessages(realtor:UserInfo, homeId:number){

        const messages = await this.prismaService.message.findMany({where:{home_id:homeId}, select:{
            message:true,
            buyer:{
                select:{
                    email:true,
                    name:true,
                    phone:true
                }
            }
        }})

        return messages

    }

}
