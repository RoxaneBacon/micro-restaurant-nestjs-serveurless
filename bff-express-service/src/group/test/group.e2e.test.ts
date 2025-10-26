import express from "express";
import supertest from "supertest";
import router from "../controller/group.controller";
import groupService from "../service/group.service";
import { MOCK_GROUP_LIST } from "../mock/group.mock";

// Mock menuService used by groupService
jest.mock("../../menu/service/menu.service", () => ({
  __esModule: true,
  default: { getMenu: jest.fn() },
}));
import menuService from "../../menu/service/menu.service";

const app = express();
app.use(express.json());
app.use("/group", router);
const request = supertest(app);

const resetGroups = () => {
  groupService.groups = JSON.parse(JSON.stringify(MOCK_GROUP_LIST));
};

beforeEach(() => {
  resetGroups();
  jest.clearAllMocks();
});

describe("GroupController - join", () => {
  it("POST /group/:code/table-number -> 200 with group", async () => {
    const res = await request.post("/group/123456/table-number");
    expect(res.status).toBe(200);
    expect(res.body.tableNumber).toBe(10);
  });

  it("POST /group/:code/table-number -> 404 when not found", async () => {
    const res = await request.post("/group/unknown/table-number");
    expect(res.status).toBe(404);
  });
});

describe("GroupController - add customers", () => {
  it("POST /group/:code/customers -> 204 then price depends on expectedCustomers", async () => {
    await request.post("/group/123456/customers").send({ count: 3 }).expect(204);
    const recap = await request.get("/group/123456/recap");
    expect(recap.status).toBe(200);
    expect(recap.body.actualCustomers).toBe(3);
    expect(recap.body.totalpriceToPay).toBe(4 * 25);
  });

  it("POST /group/:code/customers -> 204 then price depends on actualCustomers", async () => {
    await request.post("/group/123456/customers").send({ count: 1 }).expect(204);
    const recap = await request.get("/group/123456/recap");
    expect(recap.status).toBe(200);
    expect(recap.body.actualCustomers).toBe(1);
    expect(recap.body.totalpriceToPay).toBe(1 * 25);
  });

  it("POST /group/:code/customers -> 400 invalid count", async () => {
    const res = await request.post("/group/123456/customers").send({ count: 0 });
    expect(res.status).toBe(400);
  });

  it("POST /group/:code/customers -> 403 when group closed", async () => {
    await request.post("/group/654321/pay").expect(204);
    const res = await request.post("/group/654321/customers").send({ count: 1 });
    expect(res.status).toBe(403);
  });

  it("POST /group/:code/customers -> 404 when group not found", async () => {
    const res = await request.post("/group/doesnotexist/customers").send({ count: 1 });
    expect(res.status).toBe(404);
  });
});

describe("GroupController - recap", () => {
  it("GET /group/:code/recap -> 200 with recap", async () => {
    const res = await request.get("/group/654321/recap");
    expect(res.status).toBe(200);
    expect(res.body._id).toBe("654321");
  });

  it("GET /group/:code/recap -> 404 not found", async () => {
    const res = await request.get("/group/unknown/recap");
    expect(res.status).toBe(404);
  });
});

describe("GroupController - pay", () => {
  it("POST /group/:code/pay -> 204 closes group", async () => {
    const res = await request.post("/group/123456/pay");
    expect(res.status).toBe(204);
    // subsequent action should be forbidden
    const again = await request.post("/group/123456/pay");
    expect(again.status).toBe(403);
  });

  it("POST /group/:code/pay -> 404 not found", async () => {
    const res = await request.post("/group/unknown/pay");
    expect(res.status).toBe(404);
  });
});

describe("GroupController - dishes", () => {
  it("GET /group/:code/dishes -> 200 with offers applied", async () => {
    (menuService.getMenu as jest.Mock).mockResolvedValue([
      { shortName: "Saumon fumé", price: 10, extraPrice: 2 },
      { shortName: "Autre", price: 8, extraPrice: 1 },
    ]);

    const res = await request.get("/group/123456/dishes");
    expect(res.status).toBe(200);

    const included = res.body.find((d: any) => d.shortName === "Saumon fumé");
    const other = res.body.find((d: any) => d.shortName === "Autre");
    expect(included.offeredAmount).toBe(10);
    expect(included.priceToPay).toBe(2);
    expect(other.offeredAmount).toBeUndefined();
    expect(other.priceToPay).toBeUndefined();
  });

  it("GET /group/:code/dishes -> 404 not found", async () => {
    (menuService.getMenu as jest.Mock).mockResolvedValue([]);
    const res = await request.get("/group/unknown/dishes");
    expect(res.status).toBe(404);
  });

  it("GET /group/:code/dishes -> 403 closed", async () => {
    await request.post("/group/654321/pay").expect(204);
    (menuService.getMenu as jest.Mock).mockResolvedValue([]);
    const res = await request.get("/group/654321/dishes");
    expect(res.status).toBe(403);
  });
});

describe("GroupController - scénario bout en bout sur un même groupe", () => {
  it("enchaîne join -> add -> recap -> add -> dépassement -> pay -> actions interdites", async () => {
    // 1) Join initial
    const join1 = await request.post("/group/123456/table-number");
    expect(join1.status).toBe(200);
    expect(join1.body.tableNumber).toBe(10);

    // 2) Recap initial (0 client)
    const recap0 = await request.get("/group/123456/recap");
    expect(recap0.status).toBe(200);
    expect(recap0.body.actualCustomers).toBe(0);
    expect(recap0.body.totalpriceToPay).toBe(0);

    // 3) Ajout de 1 clients et recap
    await request.post("/group/123456/customers").send({ count: 1 }).expect(204);

    const recap1 = await request.get("/group/123456/recap");
    expect(recap1.status).toBe(200);
    expect(recap1.body.actualCustomers).toBe(1);
    expect(recap1.body.totalpriceToPay).toBe(1 * 25); // unit price 25 avec 1 clients attendus

    // 4) Rajout de 4 clients supplémentaires et recap
    await request.post("/group/123456/customers").send({ count: 4 }).expect(204);

    const recap5 = await request.get("/group/123456/recap");
    expect(recap5.status).toBe(200);
    expect(recap5.body.actualCustomers).toBe(5);
    expect(recap5.body.totalpriceToPay).toBe(4 * 25); // unit price 25 avec 4 clients attendus

    // 5) Rajout de 2 clients supplémentaires (dépassement de capacité autorisé) et recap
    await request.post("/group/123456/customers").send({ count: 2 }).expect(204);

    const recap7 = await request.get("/group/123456/recap");
    expect(recap7.status).toBe(200);
    expect(recap7.body.actualCustomers).toBe(7);
    expect(recap7.body.totalpriceToPay).toBe(7 * 25); // unit price 25 mais 7 clients réels


    // 7) Paiement et fermeture
    await request.post("/group/123456/pay").expect(204);

    // 8) Après fermeture: ajout clients interdit
    const addAfterClose = await request.post("/group/123456/customers").send({ count: 1 });
    expect(addAfterClose.status).toBe(403);

    // 11) Après fermeture: dishes interdit (mocker le menu pour éviter un crash dans getMenu)
    (menuService.getMenu as jest.Mock).mockResolvedValue([]);
    const dishesAfterClose = await request.get("/group/123456/dishes");
    expect(dishesAfterClose.status).toBe(403);
  });
});


