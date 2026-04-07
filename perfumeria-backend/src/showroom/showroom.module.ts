import { Module } from '@nestjs/common';
import { ShowroomService } from './showroom.service';
import { ShowroomController } from './showroom.controller';

@Module({
  providers: [ShowroomService],
  controllers: [ShowroomController]
})
export class ShowroomModule {}
