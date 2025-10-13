export type CategoryName = "STARTER" | "MAIN" | "DESSERT" | "BEVERAGE";

export interface CategoryDto {
  _id: string;
  name: CategoryName;
  displayName: string;
}
