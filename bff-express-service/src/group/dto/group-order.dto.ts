/**
 * @openapi
 * components:
 *   schemas:
 *     GroupOrderDto:
 *       type: object
 *       required:
 *         - _id
 *         - mongodbIdTable
 *         - tableNumber
 *         - expectedCustomers
 *         - actualCustomers
 *         - menuUnitPrice
 *         - menu
 *         - status
 *       properties:
 *         _id:
 *           type: string
 *           description: "Identifiant unique du groupe de commande (6 chiffres)"
 *         mongodbIdTable:
 *           type: string
 *           description: "Identifiant MongoDB de la table"
 *         tableNumber:
 *           type: number
 *           description: "Numéro de la table associée au groupe de commande"
 *         expectedCustomers:
 *           type: number
 *           description: "Nombre de clients attendus pour ce groupe de commande"
 *         actualCustomers:
 *           type: number
 *           description: "Nombre de clients réels pour ce groupe de commande"
 *         menuUnitPrice:
 *           type: number
 *           description: "Prix unitaire du menu"
 *         menu:
 *           type: object
 *           required:
 *             - dishShortNameList
 *           properties:
 *             dishShortNameList:
 *               type: array
 *               items:
 *                 type: string
 *               description: "Liste des shortNames des plats inclus dans le menu"
 *         status:
 *           type: string
 *           enum: [READY, IN_PROGRESS, CLOSED]
 *           description: "Statut du groupe de commande"
 */
export interface GroupOrderDto {
    _id: string //6 chiffres
    mongodbIdTable: string,
    tableNumber: number
    expectedCustomers: number
    actualCustomers: number
    menuUnitPrice: number
    menu: {
        dishShortNameList: string[] // Liste des shortNames des plats inclus dans le menu
    }
    status : 'READY' | 'IN_PROGRESS' | 'CLOSED'
}
