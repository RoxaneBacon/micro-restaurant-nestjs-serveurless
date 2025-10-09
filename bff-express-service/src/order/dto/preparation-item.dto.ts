/**
 * @openapi
 * components:
 *   schemas:
 *     PreparedItemDto:
 *       type: object
 *       required:
 *         - _id
 *         - shortName
 *       properties:
 *         _id:
 *           type: string
 *         shortName:
 *           type: string
 */
export interface PreparedItemDto {
    _id: string;
    shortName: string;
}
