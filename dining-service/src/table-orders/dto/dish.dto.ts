import { IngredientDto } from './ingredient.dto';

export type IngredientQuantityState = 'none' | 'base' | 'extra'; // "none" = retiré, "base" = normal, "extra" = supplément

export interface DishItemDto {
  _id: string;
  ingredient: IngredientDto;
  quantity: IngredientQuantityState;
}
