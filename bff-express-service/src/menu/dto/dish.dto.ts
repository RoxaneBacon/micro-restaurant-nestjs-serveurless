import { CategoryDto } from './category.dto';
import { AllergenDto } from './allergen.dto';
import { IngredientDto } from './ingredient.dto';

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
