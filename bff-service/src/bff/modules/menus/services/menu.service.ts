import { Injectable } from '@nestjs/common';

@Injectable()
export class MenuService {
  getHello(): string {
    return 'Hello World!';
  }
}
