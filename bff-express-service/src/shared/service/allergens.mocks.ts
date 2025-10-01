import {AllergenDto} from "../../menu/dto/allergen.dto";

export const allergens: AllergenDto[] = [
    { _id: '1', name: 'VEGE', color: 'bg-vege', displayName: 'Végétarien' },
    { _id: '2', name: 'GLUTEN_FREE', color: 'bg-gluten-free', displayName: 'Sans gluten' },
    { _id: '3', name: 'LACTOSE_FREE', color: 'bg-lactose-free', displayName: 'Sans lactose' },
    { _id: '4', name: 'NUT_FREE', color: 'bg-nut-free', displayName: 'Sans fruit à coque' },
]
