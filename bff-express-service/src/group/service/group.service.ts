import { GroupOrderRecapDto } from "../dto/group-order-recap.dto";
import { GroupOrderDto } from "../dto/group-order.dto";
import menuService from "../../menu/service/menu.service";
import { MOCK_GROUP_LIST } from "../mock/group.mock";
import axios from "axios";
import {TableDto} from "../dto/table.dto";

class GroupService {
  groups: GroupOrderDto[] = MOCK_GROUP_LIST;

  constructor() {
    this.initMockTableIds();
  }

  private initMockTableIds = async () => {
    console.log('Getting all MongoDB IDs for groups');
    for (let i = 0; i < MOCK_GROUP_LIST.length; i++) {
        await axios.get(process.env.GATEWAY_SERVICE_URL! + process.env.GATEWAY_DINING_SERVICE_URL + '/tables/' + MOCK_GROUP_LIST[i].tableNumber).then(
            (response) => {
                const table: TableDto = response.data;
                MOCK_GROUP_LIST[i].mongodbIdTable = table._id;
            }
        )
    }
  }

  doesGroupExist(code: string): boolean {
    const group = this.getGroupByCodeAndVerifStatus(code);
    return group !== undefined;
  }

  getTableNumber(code: string): number {
    console.log(`Getting table number for group with code: ${code}`);
    const group = this.getGroupByCode(code);
    return group.tableNumber;
  }

  addCustomer(code: string, customerCount: number): void {
    console.log(`Adding ${customerCount} customers to group with code: ${code}`);
    const group = this.getGroupByCodeAndVerifStatus(code);
    if (group.actualCustomers == 0) {
      group.status = 'IN_PROGRESS';
    }
    group.actualCustomers += customerCount;
  }

  getRecap(code: string): GroupOrderRecapDto {
    console.log(`Getting recap for group with code: ${code}`);
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

  pay(code: string): void {
    console.log(`Processing payment for group with code: ${code}`);
    const group = this.getGroupByCodeAndVerifStatus(code);
    group.status = 'CLOSED';
  }

  async getDishList(code: string) {
    console.log(`Getting dish list for group with code: ${code}`);
    const dishDTOList = await menuService.getMenu();
    const group = this.getGroupByCodeAndVerifStatus(code);
    return dishDTOList.map(dish => {
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
      throw new Error(`Group with code ${code} is already closed`);
    }
    return group;
  }

  private getGroupByCode(code: string): GroupOrderDto {
    const group = this.groups.find(group => group._id === code);
    if (!group) {
      throw new Error(`Group with code ${code} not found`);
    }
    return group;
  }
}

export default new GroupService();