import { Router } from "express";
import groupService from "../service/group.service";

const router = Router();

const mapError = (err: unknown) => {
  const message = err instanceof Error ? err.message : "Unexpected error";
  if (/not found/i.test(message)) return { status: 404, body: { error: message } };
  if (/closed/i.test(message)) return { status: 403, body: { error: message } };
  return { status: 500, body: { error: "Internal server error" } };
};

/**
 * @openapi
 * /group/{code}/exists:
 *   get:
 *     summary: Vérifier l'existence d'un groupe
 *     tags:
 *       - Group
 *     parameters:
 *       - name: code
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Le groupe existe
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       403:
 *         description: Le groupe est fermé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get("/:code/exists", (req, res) => {
  if (groupService.doesGroupExist(req.params.code)) {
    res.status(200).end();
  } else {
    res.status(404).end();
  }
});

/**
 * @openapi
 * /group/{code}/table:
 *   get:
 *     summary: Récupérer le numéro de table du groupe
 *     tags:
 *       - Group
 *     parameters:
 *       - name: code
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Numéro de table récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               tableNumber:
 *                 type: integer
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       403:
 *         description: Groupe fermé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get("/:code/table", (req, res) => {
  try {
    const tableNumber = groupService.getTableNumber(req.params.code);
    res.json({ tableNumber });
  } catch (err) {
    const { status, body } = mapError(err);
    res.status(status).json(body);
  }
});

/**
 * @openapi
 * /group/{code}/customers:
 *   put:
 *     summary: Ajouter des clients au groupe
 *     tags:
 *       - Group
 *     parameters:
 *       - name: code
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               count:
 *                 type: integer
 *                 minimum: 1
 *     responses:
 *       204:
 *         description: Clients ajoutés
 *       400:
 *         description: Requête invalide (count doit être un entier positif)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       403:
 *         description: Groupe fermé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.put("/:code/customers", (req, res) => {
  const code = req.params.code;
  const count = Number((req.body as any)?.count);
  if (!Number.isInteger(count) || count <= 0) {
    return res.status(400).json({ error: "count must be a positive integer" });
  }
  try {
    groupService.addCustomer(code, count);
    res.status(204).end();
  } catch (err) {
    const { status, body } = mapError(err);
    res.status(status).json(body);
  }
});

/**
 * @openapi
 * /group/{code}/recap:
 *   get:
 *     summary: Récupérer le récapitulatif du groupe
 *     tags:
 *       - Group
 *     parameters:
 *       - name: code
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Récapitulatif du groupe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GroupOrderRecapDto'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       403:
 *         description: Groupe fermé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get("/:code/recap", (req, res) => {
  try {
    const recap = groupService.getRecap(req.params.code);
    res.json(recap);
  } catch (err) {
    const { status, body } = mapError(err);
    res.status(status).json(body);
  }
});

/**
 * @openapi
 * /group/{code}/pay:
 *   put:
 *     summary: Payer et fermer le groupe
 *     tags:
 *       - Group
 *     parameters:
 *       - name: code
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Paiement effectué, groupe fermé
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       403:
 *         description: Groupe fermé (déjà payé)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.put("/:code/pay", (req, res) => {
  try {
    groupService.pay(req.params.code);
    res.status(204).end();
  } catch (err) {
    const { status, body } = mapError(err);
    res.status(status).json(body);
  }
});

/**
 * @openapi
 * /group/{code}/dishes:
 *   get:
 *     summary: Obtenir la liste des plats pour le groupe (avec offres appliquées)
 *     tags:
 *       - Group
 *     parameters:
 *       - name: code
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des plats
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DishDto'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       403:
 *         description: Groupe fermé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get("/:code/dishes", async (req, res) => {
  try {
    const dishes = await groupService.getDishList(req.params.code);
    res.json(dishes);
  } catch (err) {
    const { status, body } = mapError(err);
    res.status(status).json(body);
  }
});

export default router;