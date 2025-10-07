import {Router, Request, Response} from "express";
import MenuService from "../service/menu.service";
import {DishDto} from "../dto/dish.dto";

const router = Router();

/**
 * @openapi
 * /menu:
 *   get:
 *     summary: Get all menu items
 *     tags:
 *       - Menu
 *     responses:
 *       200:
 *         description: List of all menu items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DishDto'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get("/", (req: Request, res: Response) => {
    console.log('[MenuController] GET / - Fetching all menu items');
    const dishDtos = MenuService.getMenu();
    dishDtos.then((dishDtos: DishDto[]) => {
        console.log(`[MenuController] Successfully retrieved ${dishDtos.length} menu items`);
        res.json(dishDtos);
    })
});

/**
 * @openapi
 * /menu/categories:
 *   get:
 *     summary: Get all menu categories
 *     tags:
 *       - Menu
 *     responses:
 *       200:
 *         description: List of menu categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CategoryDto'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get("/categories", (req: Request, res: Response) => {
    console.log('[MenuController] GET /categories - Fetching all categories');
    res.json(MenuService.getCategories());
});

/**
 * @openapi
 * /menu/allergens:
 *   get:
 *     summary: Get all allergens
 *     tags:
 *       - Menu
 *     responses:
 *       200:
 *         description: List of allergens
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AllergenDto'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get("/allergens", (req: Request, res: Response) => {
    console.log('[MenuController] GET /allergens - Fetching all allergens');
    res.json(MenuService.getAllergens());
});

/**
 * @openapi
 * /menu/{id}:
 *   get:
 *     summary: Get a menu item by ID
 *     tags:
 *       - Menu
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the menu item to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Menu item found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DishDto'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get("/:id", (req: Request, res: Response) => {
    const id = req.params.id;
    console.log(`[MenuController] GET /${id} - Fetching menu item by id`);
    const item = MenuService.getItemById(req.params.id);
    item.then((value: DishDto | undefined) => {
        if (!value) {
            console.log(`[MenuController] Menu item with id ${id} not found`);
            return res.status(404).json({message: "Menu item not found"});
        }
        console.log(`[MenuController] Successfully retrieved menu item with id ${id}`);
        res.json(value);
    })
});

export default router;