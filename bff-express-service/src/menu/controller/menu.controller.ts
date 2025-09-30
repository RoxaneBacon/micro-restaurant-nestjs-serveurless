import { Router, Request, Response } from "express";
import MenuService from "../service/menu.service";

const router = Router();

/**
 * @openapi
 * /menu:
 *   get:
 *     summary: Get the full menu
 *     responses:
 *       200:
 *         description: List of menu items
 */
router.get("/", (req: Request, res: Response) => {
    res.json(MenuService.getMenu());
});

/**
 * @openapi
 * /menu/{id}:
 *   get:
 *     summary: Get a menu item by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Menu item found
 *       404:
 *         description: Menu item not found
 */
router.get("/:id", (req: Request, res: Response) => {
    const item = MenuService.getItemById(Number(req.params.id));
    if (!item) {
        return res.status(404).json({ message: "Menu item not found" });
    }
    res.json(item);
});

export default router;
