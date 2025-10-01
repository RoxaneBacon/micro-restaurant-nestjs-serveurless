import {DishDto} from "../dto/dish.dto";
import {categories} from "../../shared/service/categories.mocks";
import {allergens} from "../../shared/service/allergens.mocks";
import dotenv from "dotenv";

dotenv.config();

const API_BASE = process.env.GATEWAY_SERVICE_URL! + process.env.GATEWAY_MENU_SERVICE_URL;

class MenuService {

    /**
     * Transforms raw dish data by parsing fullName and preserving the external _id
     * @param dish - The raw dish data from the API
     * @returns Transformed DishDto with parsed fullName data and external _id
     * @private
     */
    private transformDish(dish: any): DishDto {
        // Get the dish dto that is inside dish.fullName and replace the id inside dish.fullName by the id outside
        return {...JSON.parse(dish.fullName), _id: dish._id} as DishDto;
    }

    /**
     * Fetches all dishes from the menu API
     * @returns Promise that resolves to an array of DishDto objects
     * @throws Error if the API request fails
     */
    async getMenu(): Promise<DishDto[]> {
        console.log(`Fetching menu from ${API_BASE}/menus`);
        const response = await fetch(`${API_BASE}/menus`);
        if (!response.ok) {
            throw new Error("Failed to fetch dishes");
        }
        const data = await response.json();
        return data.map((dish: any) => this.transformDish(dish));
    }

    /**
     * Fetches a specific dish by its ID
     * @param id - The unique identifier of the dish
     * @returns Promise that resolves to a DishDto object
     * @throws Error if the dish is not found or the API request fails
     */
    async getItemById(id: string): Promise<DishDto | undefined> {
        const response = await fetch(`${API_BASE}/menus/${id}`);
        if (!response.ok) {
            throw new Error(`Dish with id ${id} not found`);
        }
        const data = await response.json();
        return this.transformDish(data);
    }

    getCategories() {
        return categories;
    }

    getAllergens() {
        return allergens;
    }
}

export default new MenuService();
