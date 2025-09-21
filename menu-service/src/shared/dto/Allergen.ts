export type AllergenName = "VEGE" | "GLUTEN_FREE" | "LACTOSE_FREE" | "NUT-FREE";

export interface AllergenDto {
  _id: string;
  name: AllergenName;
}
