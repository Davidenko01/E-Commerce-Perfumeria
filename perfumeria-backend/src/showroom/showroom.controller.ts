import { Controller, Get } from '@nestjs/common';
import { ShowroomService } from './showroom.service';
import type { Showroom } from './showroom.interface';

@Controller('showroom')
export class ShowroomController {
    constructor(private readonly showroomService: ShowroomService) {}

    @Get()
    getInformation(): Showroom {
        return this.showroomService.getInfo();
    }
}
