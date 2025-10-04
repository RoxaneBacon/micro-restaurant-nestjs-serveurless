import { ApiProperty } from '@nestjs/swagger';
import { IngredientQuantityState } from '../../shared/dto/ingredient-quantity-state.dto';

export class OrderingItem {
  @ApiProperty()
  _id: string; // id of the item from the menu

  @ApiProperty()
  shortName: string;

  @ApiProperty()
  quantity: IngredientQuantityState;

  constructor(anyObject: any = {}) {
    this._id = anyObject._id || null;
    this.shortName = anyObject.shortName || null;
    this.quantity = anyObject.quantity || 'base';
  }
}
