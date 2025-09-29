export type AllergenName = 'VEGE' | 'GLUTEN_FREE' | 'LACTOSE_FREE' | 'NUT_FREE';

export interface AllergenDto {
  _id: string;
  name: AllergenName;
  color: string;
}
