import { DishDto } from '../dto/dish.dto'
import { categories } from '../../shared/service/categories.mocks'
import { allergens } from '../../shared/service/allergens.mocks'
import dotenv from 'dotenv'
import axios from 'axios'

dotenv.config()

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
        console.log(`[MenuService] Transforming dish with id: ${dish._id}`)
        const transformedDish = {
            ...JSON.parse(dish.fullName),
            _id: dish._id,
        } as DishDto
        transformedDish.extraPrice = 0 // initialiser extraPrice à 0
        transformedDish.offeredAmount = 0 // initialiser offeredAmount à 0
        transformedDish.priceToPay =
            transformedDish.price +
            transformedDish.extraPrice -
            transformedDish.offeredAmount
        console.log(
            `[MenuService] Dish transformed successfully: ${JSON.stringify(
                transformedDish
            )}`
        )
        return transformedDish
    }

    /**
     * Fetches all dishes from the menu API
     * @returns Promise that resolves to an array of DishDto objects
     * @throws Error if the API request fails
     */
    async getMenu(): Promise<DishDto[]> {
        console.log(`[MenuService.getMenu] Récupération du menu depuis l'API`);
        const response = await axios.get(`${API_BASE}/menus`);
        if (response.status !== 200) {
            console.error(`[MenuService.getMenu] Échec de récupération du menu - Statut: ${response.status}`);
            throw new Error("Failed to fetch dishes");
        }
        const dishes = response.data.map((dish: any) => this.transformDish(dish));
        console.log(`[MenuService.getMenu] Menu récupéré avec succès - ${dishes.length} plats traités`);
        return dishes;
    }

    /**
     * Fetches a specific dish by its ID
     * @param id - The unique identifier of the dish
     * @returns Promise that resolves to a DishDto object
     * @throws Error if the dish is not found or the API request fails
     */
    async getItemById(id: string): Promise<DishDto | undefined> {
        console.log(`[MenuService.getItemById] Recherche du plat avec l'ID: ${id}`);
        const response = await axios.get(`${API_BASE}/menus/${id}`);
        if (response.status !== 200) {
            console.error(`[MenuService.getItemById] Plat avec l'ID ${id} introuvable`);
            throw new Error(`Dish with id ${id} not found`);
        }
        const dish = this.transformDish(response.data);
        console.log(`[MenuService.getItemById] Plat récupéré: ${dish.shortName} (€${dish.price})`);
        return dish;
    }

    getCategories() {
        console.log('[MenuService.getCategories] Récupération des catégories de menu');
        return categories;
    }

    getAllergens() {
        console.log('[MenuService.getAllergens] Récupération de la liste des allergènes');
        return allergens;
    }
}

export default new MenuService()
