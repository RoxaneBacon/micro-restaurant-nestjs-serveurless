/**
 * @openapi
 * components:
 *   schemas:
 *    GroupOrderDto:
 *      type: object
 *     required:
 *          - _id
 *          - tableNumber
 *          - expectedCustomers
 *          - actualCustomers
 *          - menu
 *    properties:
 *      _id:
 *          type: string
 *          description: "Identifiant unique du groupe de commande (6 chiffres)"
 *      tableNumber:
 *          type: number
 *          description: "Numéro de la table associée au groupe de commande"
 *      expectedCustomers:
 *          type: number
 *          description: "Nombre de clients attendus pour ce groupe de commande"
 *      actualCustomers:
 *          type: number
 *          description: "Nombre de clients réels pour ce groupe de commande"
 *      menu:
 *          type: object
 *          required:
 *              - dishList
 *              - extraList
 *          properties:
 *              dishList:
 *                  type: array
 *                  items:
 *                      type: string
 *                      description: "Liste des shortNames des plats inclus dans le menu"
 *              extraList:
 *                  type: array
 *                  items:
 *                      type: string
 *                      description: "Nom des ingrédients en supplément inclus dans le menu"
 *
 */
export interface GroupOrderDto {
    _id: string //6 chiffres
    tableNumber: number
    expectedCustomers: number
    actualCustomers: number
    menu: {
        dishList: string[] // Liste des shortNames des plats inclus dans le menu
        extraList: string[] // Nom des ingrédients en supplément inclus dans le menu
    }
}
