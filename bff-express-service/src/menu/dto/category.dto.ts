/**
 * @openapi
 * components:
 *   schemas:
 *     CategoryName:
 *       type: string
 *       enum: [STARTER, MAIN, DESSERT, BEVERAGE, GROUPMENU]
 *       description: "Available categories for dishes"
 */

export type CategoryName = 'STARTER' | 'MAIN' | 'DESSERT' | 'BEVERAGE' | 'GROUPMENU';

/**
 * @openapi
 * components:
 *   schemas:
 *     CategoryName:
 *       $ref: '#/components/schemas/CategoryName'
 *     CategoryDto:
 *       type: object
 *       required:
 *         - _id
 *         - name
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           $ref: '#/components/schemas/CategoryName'
 *         displayName:
 *           type: string
 */
export interface CategoryDto {
    _id: string
    name: CategoryName
    displayName: string
}
