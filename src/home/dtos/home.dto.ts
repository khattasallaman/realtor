import { PropertyType } from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, ValidateNested } from 'class-validator';

export class HomeResponseDto {
  id: number;
  address: string;
  @Exclude()
  number_of_bedrooms: number;

  @Expose({name: 'number_of_bedrooms'})
  numberOfBedrooms(){
    return this.number_of_bedrooms
  }

  @Exclude()
  number_of_bathrooms: number;

  @Expose({name: 'number_of_bathrooms'})
  numberOfPathRooms(){
    return this.number_of_bathrooms
  }
  city: string;

  @Exclude()
  listed_date: Date;

  @Expose({name: 'listed_date'})
  listedDate(){
    return this.listed_date
  }
  price: number;
  land_size: number;
  property_type: PropertyType;
  @Exclude()
  created_at: Date;
  @Exclude()
  updated_at: Date;
  @Exclude()
  realtor_id: number;

  constructor(partial: Partial<HomeResponseDto>){
    Object.assign(this, partial);
  }
}


class Image {
  @IsString()
  @IsNotEmpty() 
  url:string
}

export class CreateHomeDto {
  @IsString()
  @IsNotEmpty()  
  address:string

  @IsNumber()
  @IsPositive()
  number_of_bedrooms :number;

  @IsNumber()
  @IsPositive()
  number_of_bathrooms :number;

  @IsString()
  @IsNotEmpty()  
  city  :string;

  @IsNumber()
  @IsPositive()
  price  :number;

  @IsNumber()
  @IsPositive()
  land_size   :number;

  @IsEnum(PropertyType)
  property_type :PropertyType;

  @IsArray()
  @ValidateNested({each: true})
  @Type(() => Image)
  images :Image[]
}

export class UpdateHomeDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()  
  address:string

  @IsOptional()
  @IsNumber()
  @IsPositive()
  number_of_bedrooms :number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  number_of_bathrooms :number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()  
  city  :string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  price  :number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  land_size   :number;

  @IsOptional()
  @IsEnum(PropertyType)
  property_type :PropertyType;
}
