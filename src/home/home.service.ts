import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HomeResponseDto } from './dtos/home.dto';
import { PropertyType } from '@prisma/client';

interface GetHomeParams {
  city?: string;
  price: {
    gte?: number;
    lte?: number;
  };
  propertyType?: PropertyType;
}

interface CreateHomeParams {
  address: string;
  number_of_bedrooms: number;
  number_of_bathrooms: number;
  city: string;
  price: number;
  land_size: number;
  property_type: PropertyType;
  images: { url: string }[];
}

interface UpdateHomeParams {
  address?: string;
  number_of_bedrooms?: number;
  number_of_bathrooms?: number;
  city?: string;
  price?: number;
  land_size?: number;
  property_type?: PropertyType;
}

@Injectable()
export class HomeService {
  constructor(private readonly prismaService: PrismaService) {}
  async getHomes(filters: GetHomeParams): Promise<HomeResponseDto[]> {
    const homes = await this.prismaService.home.findMany({
      select: {
        id: true,
        address: true,
        city: true,
        price: true,
        property_type: true,
        number_of_bathrooms: true,
        number_of_bedrooms: true,
        images: {
          select: {
            url: true,
          },
          take: 1,
        },
      },
      where: filters,
    });
    if (!homes.length) throw new NotFoundException();
    return homes.map((home) => new HomeResponseDto(home));
  }

  getHome(id: number) {
    return this.prismaService.home.findUnique({ where: { id } });
  }

  async createHome(body: CreateHomeParams, userId) {
    const {
      address,
      number_of_bedrooms,
      number_of_bathrooms,
      city,
      price,
      land_size,
      property_type,
      images,
    } = body;
    const home = await this.prismaService.home.create({
      data: {
        address,
        number_of_bedrooms,
        number_of_bathrooms,
        city,
        price,
        land_size,
        property_type,
        realtor_id: userId,
      },
    });

    const temImages = images.map((image) => ({
      url: image.url,
      home_id: home.id,
    }));
    const newImages = await this.prismaService.image.createMany({
      data: temImages,
    });

    return new HomeResponseDto(home);
  }

  async updateHome(body: UpdateHomeParams, id: number) {

    const home = await this.prismaService.home.findUnique({ where: { id } });
    if (!home) {
      throw new NotFoundException();
    }

    const updatedHome = await this.prismaService.home.update({
      where: { id: home.id },
      data: body,
    })
    return new HomeResponseDto(updatedHome);
  }

  async deleteHome(id: number) {
    await this.prismaService.image.deleteMany({where:{home_id:id}})
    return this.prismaService.home.delete({ where: { id } });
  }

  async getRealtorByHomeId(id: number) {
    const realtor = await this.prismaService.home.findUnique({where:{id}, select:{
      realtor:true
    }})
    if(!realtor){
      throw new NotFoundException()
    }
    return realtor
  }
}
