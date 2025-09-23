export type IngredientQuantityState = "none" | "base" | "extra"; // "none" = retiré, "base" = normal, "extra" = supplément
export interface IngredientDto {
  _id: string;
  name: string;
  extraCost: number;
  quantity: IngredientQuantityState;
}
