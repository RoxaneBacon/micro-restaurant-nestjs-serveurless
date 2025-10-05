import { IngredientDto } from './ingredient.dto';

/**
 * @openapi
 * components:
 *   schemas:
 *     IngredientQuantityState:
 *       type: string
 *       enum: [none, base, extra]
 *       description: "none = retiré, base = normal, extra = supplément"
 */
export type IngredientQuantityState = 'none' | 'base' | 'extra'; // "none" = retiré, "base" = normal, "extra" = supplément

/**
 * @openapi
 * components:
 *   schemas:
 *     DishItemDto:
 *       type: object
 *       required:
 *         - _id
 *         - ingredient
 *         - quantity
 *       properties:
 *         _id:
 *           type: string
 *         ingredient:
 *           $ref: '#/components/schemas/IngredientDto'
 *         quantity:
 *           $ref: '#/components/schemas/IngredientQuantityState'
 */
export interface DishItemDto {
  _id: string;
  ingredient: IngredientDto;
  quantity: IngredientQuantityState;
}
