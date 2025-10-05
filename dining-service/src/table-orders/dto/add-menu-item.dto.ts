import { IsMongoId, IsNotEmpty, IsPositive } from 'class-validator';
import { DishItemDto } from './dish.dto';

export class AddMenuItemDto {
  @IsMongoId()
  menuItemId: string;

  @IsNotEmpty()
  menuItemShortName: string;

  @IsNotEmpty()
  @IsPositive()
  howMany: number;

  @IsNotEmpty()
  ingredients: DishItemDto[];
}
