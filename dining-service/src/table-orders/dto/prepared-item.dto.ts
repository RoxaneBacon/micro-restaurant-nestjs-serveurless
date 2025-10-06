import { IsMongoId, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DishItemDto } from './dish.dto';

export class PreparedItemDto {
  @ApiProperty()
  @IsMongoId()
  _id: string;

  @ApiProperty()
  @IsNotEmpty()
  shortName: string;

  @ApiProperty()
  @IsNotEmpty()
  ingredients: DishItemDto[];

  static kitchenPreparedItemToPreparedItemDtoFactory(
    kitchenPreparedItem,
  ): PreparedItemDto {
    const preparedItem: PreparedItemDto = new PreparedItemDto();
    preparedItem._id = kitchenPreparedItem._id;
    preparedItem.shortName = kitchenPreparedItem.shortName;
    preparedItem.ingredients = kitchenPreparedItem.ingredients;

    return preparedItem;
  }
}
