import {PreparedItemDto} from "./preparation-item.dto";

/**
 * @openapi
 * components:
 *   schemas:
 *     PreparationDto:
 *       type: object
 *       required:
 *         - _id
 *         - shouldBeReadyAt
 *         - preparedItems
 *       properties:
 *         _id:
 *           type: string
 *         shouldBeReadyAt:
 *           type: string
 *           format: date-time
 *         preparedItems:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PreparedItemDto'
 */
export interface PreparationDto {
    _id: string;
    shouldBeReadyAt: string;
    preparedItems: PreparedItemDto[];
}
