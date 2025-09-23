// Permet d'importer plusieurs DTOs à la fois :
// import { DishDto, OrderDto } from "../dtos";

// Base entities
export type { AllergenDto, AllergenName } from "./Allergen";
export type { CategoryDto, CategoryName } from "./Category";
export type { IngredientDto, IngredientQuantityState } from "./Ingredient";

// Dish entities
export type { DishDto, DishItemDto } from "./Dish";

// Order entities
export type { OrderDto, OrderItemDto, OrderStatus } from "./Order";
