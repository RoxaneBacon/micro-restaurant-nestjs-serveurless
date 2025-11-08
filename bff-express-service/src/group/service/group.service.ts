import { GroupOrderRecapDto } from "../dto/group-order-recap.dto";
import { GroupOrderDto } from "../dto/group-order.dto";
import menuService from "../../menu/service/menu.service";
import { MOCK_GROUP_LIST } from "../mock/group.mock";
import axios from "axios";
import {TableDto} from "../dto/table.dto";
import {PreparationDto} from "../../order/dto/preparation.dto";
import {TableOrderDto} from "../../order/dto/table-order.dto";
import { NotFoundError, ForbiddenError } from "../../shared/errors/http-error";
import {DishDto} from "../../menu/dto/dish.dto";

const API_DINING_BASE = process.env.GATEWAY_SERVICE_URL! + process.env.GATEWAY_DINING_SERVICE_URL;

class GroupService {
  groups: GroupOrderDto[] = MOCK_GROUP_LIST;

  constructor() {
    this.initMockTableIds();
  }

  private initMockTableIds = async () => {
    console.log('[GroupOrderService.initMockTableIds] Initialisation des IDs MongoDB des tables pour les groupes mockés');
    for (let i = 0; i < MOCK_GROUP_LIST.length; i++) {
      try {
        // POST to initialize the table if not done yet
        const createResponse = await axios.post(`${API_DINING_BASE}/tableOrders`, {
          tableNumber: MOCK_GROUP_LIST[i].tableNumber,
          customersCount: MOCK_GROUP_LIST[i].expectedCustomers,
        });

        // The POST response should contain the created table order with its ID
        const createdTableOrder = createResponse.data;
        console.debug(`[GroupOrderService.initMockTableIds] Table order created:`, createdTableOrder);

        // Set the tableOrderId directly from the creation response
        if (createdTableOrder && createdTableOrder._id) {
          MOCK_GROUP_LIST[i].mongodbIdTable = createdTableOrder._id;
          console.debug(`[GroupOrderService.initMockTableIds] Table ${MOCK_GROUP_LIST[i].tableNumber} initialized with ID: ${createdTableOrder._id}`);
        } else {
          // Fallback: get the table info to retrieve the tableOrderId
          const getResponse = await axios.get(`${API_DINING_BASE}/tables/${MOCK_GROUP_LIST[i].tableNumber}`);
          const table: TableDto = getResponse.data;
          console.debug(`[GroupOrderService.initMockTableIds] Retrieved table info:`, table);

          if (table.tableOrderId) {
            MOCK_GROUP_LIST[i].mongodbIdTable = table.tableOrderId;
            console.debug(`[GroupOrderService.initMockTableIds] Table ${MOCK_GROUP_LIST[i].tableNumber} initialized with ID: ${table.tableOrderId}`);
          } else {
            console.error(`[GroupOrderService.initMockTableIds] No tableOrderId found for table ${MOCK_GROUP_LIST[i].tableNumber}`);
          }
        }
      } catch (error) {
        console.error(`[GroupOrderService.initMockTableIds] Error initializing table ${MOCK_GROUP_LIST[i].tableNumber}:`, error);
      }
    }
    console.log('[GroupOrderService.initMockTableIds] Initialisation terminée des IDs MongoDB des tables pour les groupes mockés');
  }

  doesGroupExist(code: string): boolean {
    console.log(`[GroupOrderService.doesGroupExist] Vérification de l'existence du groupe avec le code : ${code}`);
    return this.groups.some(group => group._id === code && group.status !== 'CLOSED');
  }

  async getTableNumber(code: string): Promise<number> {
    console.log(`[GroupOrderService.startOrderPreparation] Récupération du numéro de table pour le groupe avec le code : ${code}`);
    const group = this.getGroupByCode(code);
    return group.tableNumber;
  }

  async addCustomer(code: string, customerCount: number): Promise<void> {
    console.log(`[GroupOrderService.startOrderPreparation] Ajout de ${customerCount} client(s) au groupe avec le code : ${code}`);
    const group = this.getGroupByCodeAndVerifStatus(code);
    if (group.actualCustomers == 0) {
      group.status = 'IN_PROGRESS';
    }
    group.actualCustomers += customerCount;
  }

  async getRecap(code: string): Promise<GroupOrderRecapDto> {
    console.log(`[GroupOrderService.startOrderPreparation] Récupération du récapitulatif pour le groupe avec le code : ${code}`);
    const group = this.getGroupByCode(code);
    return {
      _id: group._id,
      tableNumber: group.tableNumber,
      expectedCustomers: group.expectedCustomers,
      actualCustomers: group.actualCustomers,
      menuUnitPrice: group.menuUnitPrice,
      totalpriceToPay: this.computeGroupTotalPrice(group),
    };
  }

  private computeGroupTotalPrice(group: GroupOrderDto): number {
    if(Math.abs(group.actualCustomers - group.expectedCustomers) <= 2) {
      return group.expectedCustomers * group.menuUnitPrice;
    }
    return group.actualCustomers * group.menuUnitPrice;
  }

  async pay(code: string): Promise<void> {
    console.log(`[GroupOrderService.pay] Paiement final pour le groupe avec le code : ${code}`);
    const group = this.getGroupByCodeAndVerifStatus(code);
    await this.payOrder(group.mongodbIdTable);
    group.status = 'CLOSED';
  }

  private async startOrderPreparation(tableOrderId: string) {
    console.log(`[GroupOrderService.startOrderPreparation] Démarrage de la préparation en cuisine pour la commande ${tableOrderId}`);
    const response = await axios.post(`${API_DINING_BASE}/tableOrders/${tableOrderId}/prepare`);
    return response.data as PreparationDto;
  }

  private async payOrder(tableOrderId: string): Promise<TableOrderDto> {
    console.log(`[GroupOrderService.payOrder] Traitement du paiement final pour la commande ${tableOrderId}`);

    // Start the preparation of the order
    await this.startOrderPreparation(tableOrderId);

    // Pay the order
    const response = await axios.post(`${API_DINING_BASE}/tableOrders/${tableOrderId}/bill`);
    console.log(`[GroupOrderService.payOrder] Commande ${tableOrderId} facturée avec succès et envoyée en cuisine`);
    return response.data as TableOrderDto;
  }

  async getDishList(code: string): Promise<DishDto[]> {
    console.log(`[GroupOrderService.startOrderPreparation] Récupération du menu pour le groupe avec le code : ${code}`);
    const dishDTOList: DishDto[] = await menuService.getMenu();
    const group: GroupOrderDto = this.getGroupByCodeAndVerifStatus(code);
    return dishDTOList.map((dish: DishDto) => {
      if (group.menu.dishShortNameList.includes(dish.shortName)) {
        dish.offeredAmount = dish.price;
        dish.priceToPay = dish.price + dish.extraPrice - dish.offeredAmount;
      }
      return dish;
    });
  }

  private getGroupByCodeAndVerifStatus(code: string): GroupOrderDto {
    const group = this.getGroupByCode(code);
    if (group.status === 'CLOSED') {
      throw new ForbiddenError(`Group with code ${code} is already closed`);
    }
    return group;
  }

  private getGroupByCode(code: string): GroupOrderDto {
    const group = this.groups.find(group => group._id === code);
    if (!group) {
      throw new NotFoundError(`Group with code ${code} not found`);
    }
    return group;
  }
}

export default new GroupService();