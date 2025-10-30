import { GroupOrderRecapDto } from "../dto/group-order-recap.dto";
import { GroupOrderDto } from "../dto/group-order.dto";
import menuService from "../../menu/service/menu.service";
import { MOCK_GROUP_LIST } from "../mock/group.mock";

class GroupService {
  groups: GroupOrderDto[] = MOCK_GROUP_LIST;

  doesGroupExist(code: string): boolean {
    return this.groups.some(group => group._id === code);
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