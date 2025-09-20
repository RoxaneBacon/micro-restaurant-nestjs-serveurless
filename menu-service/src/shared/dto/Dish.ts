import { AllergenDto } from "./Allergen";
import { CategoryDto } from "./Category";
import { IngredientDto } from "./Ingredient";

export interface DishItemDto {
  _id: string;
  ingredient: IngredientDto;
  quantity: number;
}

export interface DishDto {
  _id: string;
  fullName: string;
  shortName: string;
  description: string;
  category: CategoryDto;
  price: number;
  allergens: AllergenDto[];
  ingredients: IngredientDto[];
  image?: string | null;
}
