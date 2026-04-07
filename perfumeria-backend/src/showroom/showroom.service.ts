import { Injectable } from '@nestjs/common';
import { Showroom } from './showroom.interface';
import { SHOWROOM_MOCKS } from './showroom.mock';

@Injectable()
export class ShowroomService {
  private showroom: Showroom = SHOWROOM_MOCKS;

  getInfo(): Showroom {
    return this.showroom;
  }
}
