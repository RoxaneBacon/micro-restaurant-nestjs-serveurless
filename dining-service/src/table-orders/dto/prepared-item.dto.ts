import { IsMongoId, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IngredientQuantityState } from '../../shared/dto/ingredient-quantity-state.dto';

export class PreparedItemDto {
  @ApiProperty()
  @IsMongoId()
  _id: string;

  @ApiProperty()
  @IsNotEmpty()
  shortName: string;

  @ApiProperty()
  @IsNotEmpty()
  quantity: IngredientQuantityState;

  static kitchenPreparedItemToPreparedItemDtoFactory(kitchenPreparedItem): PreparedItemDto {
    const preparedItem: PreparedItemDto = new PreparedItemDto();
    preparedItem._id = kitchenPreparedItem._id;
    preparedItem.shortName = kitchenPreparedItem.shortName;
    preparedItem.quantity = kitchenPreparedItem.quantity;

    return preparedItem;
  }
}
