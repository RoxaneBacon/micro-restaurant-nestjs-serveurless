import { CategoryDto } from './category.dto';
import { AllergenDto } from './allergen.dto';
import { IngredientDto } from './ingredient.dto';

export type IngredientQuantityState = "none" | "base" | "extra"; // "none" = retiré, "base" = normal, "extra" = supplément

export interface DishItemDto {
  _id: string;
  ingredient: IngredientDto;
  quantity: IngredientQuantityState;
}

export interface DishDto {
  _id: string;
  fullName: string;
  shortName: string;
  description: string;
  category: CategoryDto;
  price: number;
  allergens: AllergenDto[];
  ingredients: DishItemDto[];
  image?: string | null;
}
