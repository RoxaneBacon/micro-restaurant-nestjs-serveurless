import { OnApplicationBootstrap } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

import { AddMenuItemDto } from '../../menus/dto/add-menu-item.dto';

import { CategoryEnum } from '../../menus/schemas/category-enum.schema';
import { dishes } from './dishes.mocks';

export class StartupLogicService implements OnApplicationBootstrap {
  constructor(@InjectConnection() private connection: Connection) {}

  createMenuItem(fullName: string, shortName: string, price: number, category: CategoryEnum, image: string = null): AddMenuItemDto {
    const menuItem: AddMenuItemDto = new AddMenuItemDto();
    menuItem.fullName = fullName;
    menuItem.shortName = shortName;
    menuItem.price = price;
    menuItem.category = category;
    menuItem.image = image;
    return menuItem;
  }

  async addMenuItem(fullName: string, shortName: string, price: number, category: CategoryEnum, image: string = null) {
    const menuItemModel = this.connection.models['MenuItem'];

    const alreadyExists = await menuItemModel.find({ shortName });
    if (alreadyExists.length > 0) {
      throw new Error('Menu Item already exists.');
    }

    return menuItemModel.create(this.createMenuItem(fullName, shortName, price, category, image));
  }

  async onApplicationBootstrap() {
     try {
      await this.addMenuItem(
        JSON.stringify(dishes[0]),
        dishes[0].shortName,
        dishes[0].price,
        CategoryEnum[dishes[0].category.name],
        dishes[0].image,
      );
    } catch (e) {}

    try {
      await this.addMenuItem(
        JSON.stringify(dishes[1]),
        dishes[1].fullName,
        dishes[1].price,
        CategoryEnum[dishes[1].category.name],
        dishes[1].image,
      );
    } catch (e) {}

    try {
      await this.addMenuItem(
        JSON.stringify(dishes[2]),
        dishes[2].fullName,
        dishes[2].price,
        CategoryEnum[dishes[2].category.name],
        dishes[2].image,
      );
    } catch (e) {}

    try {
      await this.addMenuItem(
        JSON.stringify(dishes[3]),
        dishes[3].fullName,
        dishes[3].price,
        CategoryEnum[dishes[3].category.name],
        dishes[3].image,
      );
    } catch (e) {}

    try {
      await this.addMenuItem(
        JSON.stringify(dishes[4]),
        dishes[4].fullName,
        dishes[4].price,
        CategoryEnum[dishes[4].category.name],
        dishes[4].image,
      );
    } catch (e) {}
    
    try {
      await this.addMenuItem(
        JSON.stringify(dishes[5]),
        dishes[5].fullName,
        dishes[5].price,
        CategoryEnum[dishes[5].category.name],
        dishes[5].image,
      );
    }
    catch (e) {}
    try {
      await this.addMenuItem(
        JSON.stringify(dishes[6]),
        dishes[6].fullName,
        dishes[6].price,
        CategoryEnum[dishes[6].category.name],
        dishes[6].image,
      );
    } catch (e) {}
    try {
      await this.addMenuItem(
        JSON.stringify(dishes[7]),
        dishes[7].fullName,
        dishes[7].price,
        CategoryEnum[dishes[7].category.name],
        dishes[7].image,
      );
    } catch (e) {}

    try {
      await this.addMenuItem(
        JSON.stringify(dishes[8]),
        dishes[8].fullName,
        dishes[8].price,
        CategoryEnum[dishes[8].category.name],
        dishes[8].image,
      );
    }
    catch (e) {}
    try {
      await this.addMenuItem(
        JSON.stringify(dishes[9]),
        dishes[9].fullName,
        dishes[9].price,
        CategoryEnum[dishes[9].category.name],
        dishes[9].image,
      );
    } catch (e) {}
    try {
      await this.addMenuItem(
        JSON.stringify(dishes[10]),
        dishes[10].fullName,  
        dishes[10].price,
        CategoryEnum[dishes[10].category.name],
        dishes[10].image,
      );
    } catch (e) {}
    try {
      await this.addMenuItem(
        JSON.stringify(dishes[11]),
        dishes[11].fullName,  
        dishes[11].price,
        CategoryEnum[dishes[11].category.name],
        dishes[11].image,
      );
    } catch (e) {}  
  }
}
