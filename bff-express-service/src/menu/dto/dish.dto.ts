import { CategoryDto } from './category.dto'
import { AllergenDto } from './allergen.dto'
import { IngredientDto } from './ingredient.dto'

/**
 * @openapi
 * components:
 *   schemas:
 *     IngredientQuantityState:
 *       type: string
 *       enum: [none, base, extra]
 *       description: "none = retiré, base = normal, extra = supplément"
 */
export type IngredientQuantityState = 'none' | 'base' | 'extra' // "none" = retiré, "base" = normal, "extra" = supplément

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
    _id: string
    ingredient: IngredientDto
    quantity: IngredientQuantityState
}

/**
 * @openapi
 * components:
 *   schemas:
 *     IngredientQuantityState:
 *       $ref: '#/components/schemas/IngredientQuantityState'
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
 *     DishDto:
 *       type: object
 *       required:
 *         - _id
 *         - fullName
 *         - shortName
 *         - description
 *         - category
 *         - price
 *         - allergens
 *         - ingredients
 *       properties:
 *         _id:
 *           type: string
 *         fullName:
 *           type: string
 *         shortName:
 *           type: string
 *         description:
 *           type: string
 *         category:
 *           $ref: '#/components/schemas/CategoryDto'
 *         price:
 *           type: number
 *           format: float
 *         allergens:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/AllergenDto'
 *         ingredients:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/DishItemDto'
 *         image:
 *           type: string
 *           nullable: true
 *        extraPrice:
 *           type: number
 *           format: float
 *        offeredAmount:
 *           type: number
 *           format: float
 *        priceToPay:
 *           type: number
 *           format: float
 */
export interface DishDto {
    _id: string
    fullName: string
    shortName: string
    description: string
    category: CategoryDto
    price: number // prix UNIQUEMENT du plat sans extra ni réduction
    allergens: AllergenDto[]
    ingredients: DishItemDto[]
    image?: string | null
    extraPrice: number // la somme des extra ajouté au plat
    offeredAmount: number // la somme offerte, utilisable dans le cas d'un menu incluant des plats
    priceToPay: number // le prix à payer = price + extraPrice - offeredAmount
}
