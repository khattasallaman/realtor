import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { HomeModule } from 'src/home/home.module';

@Module({
  imports:[PrismaModule, HomeModule],
  controllers: [MessageController],
  providers: [MessageService]
})
export class MessageModule {}
