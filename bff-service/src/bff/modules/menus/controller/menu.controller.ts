// src/bff/modules/menu/menu.controller.ts
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MenuService } from '../services/menu.service';

@ApiTags('Menu')
@Controller('api')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  getHello(): string {
    return this.menuService.getHello();
  }
}
