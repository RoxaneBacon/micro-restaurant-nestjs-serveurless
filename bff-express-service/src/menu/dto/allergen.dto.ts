/**
 * @openapi
 * components:
 *   schemas:
 *     AllergenName:
 *       type: string
 *       enum: [VEGE, GLUTEN_FREE, LACTOSE_FREE, NUT_FREE]
 *       description: "Available allergen types"
 */
export type AllergenName = 'VEGE' | 'GLUTEN_FREE' | 'LACTOSE_FREE' | 'NUT_FREE';

/**
 * @openapi
 * components:
 *   schemas:
 *     AllergenName:
 *       $ref: '#/components/schemas/AllergenName'
 *     AllergenDto:
 *       type: object
 *       required:
 *         - _id
 *         - name
 *         - color
 *         - displayName
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           $ref: '#/components/schemas/AllergenName'
 *         color:
 *           type: string
 *         displayName:
 *           type: string
 */
export interface AllergenDto {
  _id: string;
  name: AllergenName;
  color: string;
  displayName: string;
}
