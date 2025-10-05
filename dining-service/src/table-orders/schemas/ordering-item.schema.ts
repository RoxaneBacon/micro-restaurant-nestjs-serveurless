import { ApiProperty } from '@nestjs/swagger';
import { DishItemDto } from '../dto/dish.dto';

export class OrderingItem {
  @ApiProperty()
  _id: string; // id of the item from the menu

  @ApiProperty()
  shortName: string;

  @ApiProperty()
  ingredients: DishItemDto[];

  constructor(anyObject: any = {}) {
    this._id = anyObject._id || null;
    this.shortName = anyObject.shortName || null;
    this.ingredients = anyObject.ingredients || [];
  }
}
