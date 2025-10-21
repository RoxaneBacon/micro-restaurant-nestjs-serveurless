/**
 * @openapi
 * components:
 *   schemas:
 *     GroupOrderRecapDto:
 *       type: object
 *       required:
 *         - _id
 *         - tableNumber
 *       properties:
 *         _id:
 *           type: string
 *           description: "Identifiant unique du groupe de commande (6 chiffres)"
 *         tableNumber:
 *           type: number
 *           description: "Numéro de la table associée au groupe de commande"
 *         expectedCustomers:
 *           type: number
 *           description: "Nombre de clients attendus pour ce groupe de commande"
 *         actualCustomers:
 *           type: number
 *           description: "Nombre de clients réels pour ce groupe de commande"
 *          menu:
 *           type: object
 *           required:
 *              - dishList
 *              - extraList
 *           properties:
 *              dishList:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: "Liste des shortNames des plats inclus dans le menu"
 *              extraList:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: "Nom des ingrédients en supplément inclus dans le menu"
 *           totalpriceToPay:
 *               type: number
 *               description: "Prix total à payer pour le groupe de commande"
 *           totalpriceToPay: number // actualCustomers * menuUnitPrice
 *
 */

export interface GroupOrderRecapDto {
    _id: string //6 chiffres
    tableNumber: number
    expectedCustomers: number
    actualCustomers: number
    menu: {
        dishList: string[] // Liste des shortNames des plats inclus dans le menu
        extraList: string[] // Nom des ingrédients en supplément inclus dans le menu
    }
    totalpriceToPay: number // actualCustomers * menuUnitPrice
}
