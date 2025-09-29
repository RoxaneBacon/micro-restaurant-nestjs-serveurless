import {DishDto} from "../dto/dish.dto";

class MenuService {

    getMenu(): DishDto[] {
        return []
    }

    getItemById(id: number): DishDto | undefined {
        return undefined;
    }
}

export default new MenuService();
