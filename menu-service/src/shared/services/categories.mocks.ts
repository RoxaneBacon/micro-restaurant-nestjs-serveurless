import { CategoryEnum } from 'src/menus/schemas/category-enum.schema';
import { CategoryDto } from '../dto';

export const categories: CategoryDto[] = [
    { _id: '1', name: 'STARTER', displayName: 'Entrées' },
    { _id: '2', name: 'MAIN', displayName: 'Plats' },
    { _id: '3', name: 'DESSERT', displayName: 'Desserts' },
    { _id: '4', name: 'BEVERAGE', displayName: 'Boissons' },
]

