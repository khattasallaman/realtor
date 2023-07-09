import { Controller, Delete, Get, Post, Put, Query, ParseIntPipe, Param, Body, UnauthorizedException, UseGuards } from '@nestjs/common';
import { HomeService } from './home.service';
import { CreateHomeDto, HomeResponseDto, UpdateHomeDto } from './dtos/home.dto';
import { PropertyType, UserType } from '@prisma/client';
import { User, UserInfo } from 'src/user/decorators/user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { Roles } from 'src/decorators/role.decorator';

@Controller('home')
export class HomeController {

    constructor(private readonly homeService:HomeService){}


    @Get()
    getHomes(
        @Query("city") city:string,
        @Query("minPrice") minPrice:string,
        @Query("maxPrice") maxPrice:string,
        @Query("propertyType") propertyType:PropertyType,
    ): Promise<HomeResponseDto[]>{
        const price = minPrice || maxPrice ? {
            ...(minPrice && {gte: parseFloat(minPrice)}),
            ...(maxPrice && {lte:parseFloat(maxPrice)}),
        }: undefined
        const filters = {
            ...(city && {city}),
            ...(price && {price}),
            ...(propertyType && {propertyType}),
          }
        return this.homeService.getHomes(filters)
    }

    @Get(":id")
    getHome(@Param("id", ParseIntPipe) id:number){
        return this.homeService.getHome(id)
    }

    @Roles(UserType.REALTOR, UserType.ADMIN)
    @Post()
    createHome(
        @Body() body:CreateHomeDto,
        @User() user: UserInfo
    ){
        // return "test"
        return this.homeService.createHome(body, user.id)
    }

    @Roles(UserType.REALTOR, UserType.ADMIN)
    @Put(":id")
   async updateHome(@Body() body:UpdateHomeDto, @Param("id", ParseIntPipe) id :number, @User() user :UserInfo){
        const result = await this.homeService.getRealtorByHomeId(id)
        if(user.id !== result.realtor.id){
            throw new UnauthorizedException()
        }
        return this.homeService.updateHome(body, id)
    }

    @Roles(UserType.REALTOR)
    @Delete(":id")
    async deleteHome(@Param("id", ParseIntPipe) id:number, @User() user:UserInfo){
        const result = await this.homeService.getRealtorByHomeId(id)
        if(user.id !== result.realtor.id){
            throw new UnauthorizedException()
        }
        this.homeService.deleteHome(id)
    }

    @Get("/me")
    me(@User() user:UserInfo){
        return user
    }

}
