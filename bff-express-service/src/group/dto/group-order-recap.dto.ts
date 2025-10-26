/**
 * @openapi
 * components:
 *   schemas:
 *     GroupOrderRecapDto:
 *       type: object
 *       required:
 *         - _id
 *         - tableNumber
 *         - expectedCustomers
 *         - actualCustomers
 *         - menuUnitPrice
 *         - totalpriceToPay
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
 *         menuUnitPrice:
 *           type: number
 *           description: "Prix unitaire du menu"
 *         totalpriceToPay:
 *           type: number
 *           description: "Prix total à payer pour le groupe de commande"
 */

export interface GroupOrderRecapDto {
    _id: string //6 chiffres
    tableNumber: number
    expectedCustomers: number
    actualCustomers: number
    menuUnitPrice: number
    totalpriceToPay: number // actualCustomers * menuUnitPrice
}
