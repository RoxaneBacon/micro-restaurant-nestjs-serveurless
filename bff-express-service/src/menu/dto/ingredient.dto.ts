/**
 * @openapi
 * components:
 *   schemas:
 *     IngredientDto:
 *       type: object
 *       required:
 *         - _id
 *         - name
 *         - extraCost
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         extraCost:
 *           type: number
 *           format: float
 */
export interface IngredientDto {
  _id: string;
  name: string;
  extraCost: number;
}
