import { Test, TestingModule } from '@nestjs/testing';
import { MenuController } from './menu.controller';
import { MenuService } from '../services/menu.service';

describe('MenuController', () => {
  let appController: MenuController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MenuController],
      providers: [MenuService],
    }).compile();

    appController = app.get<MenuController>(MenuController);

    describe('root', () => {
      it('should return "Hello World!"', () => {
        expect(appController.getHello()).toBe('Hello World!');
      });
    });
  });
});
