// tests/order.e2e.test.ts
import express from "express";
import supertest from "supertest";
import axios from "axios";
import OrderService from "../../service/order.service";
import router from "../../controller/order.controller";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Helpers / fixtures
const DISH_NO_EXTRAS = {
    _id: "dish1",
    fullName: "Pasta Carbonara",
    shortName: "Carbonara",
    description: "Nice pasta",
    category: { _id: "cat1", name: "mains" },
    price: 10,
    allergens: [],
    ingredients: [
        { _id: "i1", ingredient: { _id: "ing1", extraCost: 0 }, quantity: "base" }
    ],
};

const FIX_ORDER = {
    _id: "order123",
    tableId: 12,
    status: "OPEN" as const,
    items: [
        {
            _id: "item1",
            _mongoId: "mongoItem1",
            dish: DISH_NO_EXTRAS,
            quantity: 2,
            price: 20, // price per item object (service computes internally too)
            payments: [],
            sharedBy: undefined,
            leftToPay: 20,
        },
    ],
    openedAt: new Date().toISOString(),
    customerCount: 2,
} as const;

beforeEach(() => {
    jest.resetAllMocks();
    // clear in-memory partialPaymentStorage between tests
    (OrderService as any).partialPaymentStorage = {};
});

function setupAxiosMocksForCreateOrder(tableOrderId = "tableOrder123") {
    // Mock POST to initialize table
    mockedAxios.post.mockImplementation(async (url: string, body?: any) => {
        if (url.endsWith("/tableOrders") && (!/\/tableOrders\/\w+/.test(url))) {
            return {
                status: 201,
                data: {
                    _id: tableOrderId,
                    tableNumber: Number(body.tableNumber || FIX_ORDER.tableId),
                    customersCount: body.customersCount,
                    opened: new Date().toISOString(),
                    lines: [],
                    preparations: [],
                    billed: null,
                },
            };
        }
        // adding an item to table order
        const tableOrderAddItemRegex = /\/tableOrders\/([^/]+)$/;
        const m = url.match(tableOrderAddItemRegex);
        if (m) {
            // add line -> return 201
            return { status: 201, data: { _id: `line-${Math.random().toString(36).slice(2)}` } };
        }

        // fallback: for other endpoints like /prepare or /bill return success
        if (url.endsWith("/prepare")) {
            return { status: 200, data: { _id: "prep1", shouldBeReadyAt: new Date().toISOString(), preparedItems: [] } };
        }
        if (url.endsWith("/bill")) {
            return { status: 200, data: { _id: "billedTableOrderId", billed: new Date().toISOString() } };
        }

        // default: throw so tests fail if unexpected
        throw new Error(`Unexpected axios POST to ${url}`);
    });
}

describe("Order controller + service end-to-end", () => {
    const app = express();
    app.use(express.json());
    app.use("/order", router);
    const request = supertest(app);

    test("POST /order - creates a table order and adds items (happy path)", async () => {
        setupAxiosMocksForCreateOrder("tableOrderABC");

        const res = await request.post("/order").send(FIX_ORDER);

        expect(res.status).toBe(201);
        // response returns the tableOrder._id as in your service
        expect(res.body).toBe("tableOrderABC");

        // ensure axios was called to initialize table + to add item(s)
        expect(mockedAxios.post).toHaveBeenCalled();
        const firstCallUrl = mockedAxios.post.mock.calls[0][0] as string;
        expect(firstCallUrl).toMatch(/\/tableOrders$/);
    });

    test("POST /order - initialize table failure -> service throws -> controller handles", async () => {
        // make initialize table return non-201
        mockedAxios.post.mockResolvedValueOnce({ status: 500, data: null });

        const res = await request.post("/order").send(FIX_ORDER);

        // In your service you throw -> controller catches via handlePromiseError -> should be 500
        // handlePromiseError implementation might set 500; if your handler differs adapt the expectation.
        expect(res.status).toBe(500);
    });

    test("POST /order/payment - paying part of item returns updated order", async () => {
        // No axios calls needed for payOrderPart; use real service method
        const paymentList = [{
            payment: {
                _id: FIX_ORDER.items[0]._id,
                timestamp: new Date().toISOString(),
                amount: 10,
                status: "PENDING"
            },
            sharedBy: 1
        }];
        const res = await request
            .post(`/order/payment`)
            .send({ orderDto: FIX_ORDER, paymentList });

        expect(res.status).toBe(200);
        expect(res.body).toBeDefined();
        // item payments array must include the new payment with status and timestamp set by service
        const returnedItem = res.body.items.find((it: any) => it._id === FIX_ORDER.items[0]._id);
        expect(returnedItem).toBeDefined();
        expect(Array.isArray(returnedItem.payments)).toBe(true);
        const p = returnedItem.payments[0];
        expect(p.amount).toBe(10);
        expect(p.status).toBe("PENDING");
        expect(p.timestamp).toBeDefined();
    });

    test("POST /order/payment - returns 422 when item not found in order", async () => {
        // Payment for an item that doesn't exist in the order
        const paymentList = [{
            payment: {
                _id: "nonexistent-item-id",
                timestamp: new Date().toISOString(),
                amount: 10,
                status: "PENDING"
            },
            sharedBy: 1
        }];
        const res = await request
            .post(`/order/payment`)
            .send({ orderDto: FIX_ORDER, paymentList });

        expect(res.status).toBe(422);
        expect(res.body).toBeDefined();
        expect(res.body.error).toBe("UnprocessableEntity");
        expect(res.body.message).toContain("nonexistent-item-id");
        expect(res.body.message).toContain("non trouvé");
    });

    test("POST /order/pay - returns 200 and false when order is not fully paid", async () => {
        // Ensure partialPaymentStorage is empty -> not fully paid
        const res = await request.post("/order/pay").send(FIX_ORDER);
        expect(res.status).toBe(200);
        expect(res.body).toBe(false);
    });

    test("POST /order/pay - returns 200 when order is fully paid and triggers downstream calls", async () => {
        // prepare axios mocks for prepare + bill (payOrder will call these)
        mockedAxios.post.mockImplementation(async (url: string, body?: any) => {
            if (url.endsWith("/tableOrders") && (!/\/tableOrders\/\w+/.test(url))) {
                return { status: 201, data: { _id: "tableOrderForPay", tableNumber: 12, customersCount: 2 } };
            }
            if (url.endsWith("/prepare")) {
                return { status: 200, data: { _id: "prep1", shouldBeReadyAt: new Date().toISOString(), preparedItems: [] } };
            }
            if (url.endsWith("/bill")) {
                return { status: 200, data: { _id: "tableOrderForPay", billed: new Date().toISOString() } };
            }
            // fallback for adding items
            if (/\/tableOrders\/[^/]+$/.test(url)) {
                return { status: 201, data: { _id: "line1" } };
            }
            throw new Error("Unexpected axios POST: " + url);
        });

        // Pre-populate partialPaymentStorage so the service considers the item fully paid.
        // We compute price using the service calculation: dish.price * quantity (no extras).
        const price = DISH_NO_EXTRAS.price * FIX_ORDER.items[0].quantity; // 10 * 2 = 20
        (OrderService as any).partialPaymentStorage[FIX_ORDER._id] = {
            [FIX_ORDER.items[0]._id]: {
                price,
                sharedBy: 1,
                payments: [{ payer: "u", amount: 20 }],
            },
        };

        // spy on OrderService.payOrder to ensure it's called (calls axios /prepare & /bill)
        const paySpy = jest.spyOn(OrderService as any, "payOrder");

        const res = await request.post("/order/pay").send(FIX_ORDER);
        expect(res.status).toBe(200);
        expect(res.body).toBe(true);

        expect(paySpy).toHaveBeenCalled();
    });
});
