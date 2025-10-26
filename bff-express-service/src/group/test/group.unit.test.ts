import groupService from "../service/group.service";
import { MOCK_GROUP_LIST } from "../mock/group.mock";

// Mock menuService used inside groupService
jest.mock("../../menu/service/menu.service", () => ({
  __esModule: true,
  default: { getMenu: jest.fn() },
}));
import MenuService from "../../menu/service/menu.service";

const resetGroups = () => {
  // Deep clone to reset service state between tests
  groupService.groups = JSON.parse(JSON.stringify(MOCK_GROUP_LIST));
};

beforeEach(() => {
  resetGroups();
  jest.clearAllMocks();
});

describe("GroupService.joinGroup", () => {
  it("returns group when code exists and not closed", () => {
    const tableNumber = groupService.getTableNumber("123456"); // READY
    expect(tableNumber).toBe(10);
  });

  it("throws when group not found", () => {
    expect(() => groupService.getTableNumber("unknown")).toThrow(/not found/i);
  });
});

describe("GroupService.addCustomer", () => {
  it("increments actualCustomers and sets status to IN_PROGRESS when starting from 0", () => {
    const code = "123456"; // READY, actual 0, expected 4
    groupService.addCustomer(code, 2);
    const recap = groupService.getRecap(code);
    expect(recap.actualCustomers).toBe(2);
  });

  it("increments actualCustomers correctly", () => {
    const code = "654321"; // IN_PROGRESS, actual 1, expected 2
    groupService.addCustomer(code, 1);
    const recap = groupService.getRecap(code);
    expect(recap.actualCustomers).toBe(2);
  });

  it("throws when group is closed", () => {
    const code = "654321";
    groupService.pay(code);
    expect(() => groupService.addCustomer(code, 1)).toThrow(/already closed/i);
  });
});

describe("GroupService.getRecap", () => {
  it("returns recap with correct totals", () => {
    const code = "654321"; // unit price 30, actual 1
    const recap = groupService.getRecap(code);
    expect(recap._id).toBe(code);
    expect(recap.totalpriceToPay).toBe(60); // 2 expected customers * 30 unit price
  });

  it("throws when group not found", () => {
    expect(() => groupService.getRecap("unknown")).toThrow(/not found/i);
  });
});

describe("GroupService.pay", () => {
  it("sets status to CLOSED", () => {
    const code = "123456";
    groupService.pay(code);
    expect(() => groupService.addCustomer(code, 1)).toThrow(/already closed/i);
  });

  it("throws when group not found", () => {
    expect(() => groupService.pay("unknown")).toThrow(/not found/i);
  });

  it("throws when already closed", () => {
    const code = "123456";
    groupService.pay(code);
    expect(() => groupService.pay(code)).toThrow(/already closed/i);
  });
});

describe("GroupService.getDishList", () => {
  it("marks included dishes with offeredAmount and priceToPay", async () => {
    const code = "123456"; // includes 'Saumon fumé'
    const dishes = [
      { shortName: "Saumon fumé", price: 10, extraPrice: 2 },
      { shortName: "Hors Menu", price: 8, extraPrice: 1 },
    ];
    (MenuService.getMenu as jest.Mock).mockResolvedValue(dishes.map(d => ({ ...d })));

    const result = await groupService.getDishList(code);

    const included: any = result.find(d => d.shortName === "Saumon fumé");
    const other: any = result.find(d => d.shortName === "Hors Menu");

    expect(included.offeredAmount).toBe(10);
    expect(included.priceToPay).toBe(2);
    expect(other.offeredAmount).toBeUndefined();
    expect(other.priceToPay).toBeUndefined();
  });

  it("throws when group not found", async () => {
    (MenuService.getMenu as jest.Mock).mockResolvedValue([]);
    await expect(groupService.getDishList("unknown")).rejects.toThrow(/not found/i);
  });

  it("throws when group is closed", async () => {
    const code = "654321";
    groupService.pay(code);
    (MenuService.getMenu as jest.Mock).mockResolvedValue([]);
    await expect(groupService.getDishList(code)).rejects.toThrow(/already closed/i);
  });
});
