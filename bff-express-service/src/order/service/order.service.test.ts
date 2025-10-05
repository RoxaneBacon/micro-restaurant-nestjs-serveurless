import axios from "axios";
import OrderService from "./order.service";
import { OrderDto } from "../dto/order.dto";
import { TableDto } from "../dto/table.dto";
import { TableOrderDto } from "../dto/table-order.dto";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("OrderService", () => {
    const mockTable: TableDto = {
        _id: "123",
        number: 1,
        taken: false,
        tableOrderId: "",
    };

    const mockTableOrder: TableOrderDto = {
        _id: "123",
        tableNumber: 1,
        customersCount: 2,
        opened: new Date(),
        lines: [],
        preparations: [],
        billed: new Date(),
    };

    const mockOrder: OrderDto = {
        _id: "mockOrder",
        customerCount: 2,
        items: [
            {
                _id: "item1",
                dish: { shortName: "Pasta" },
                quantity: 1,
            },
        ],
    } as any;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // ----------------------------
    // createOrder tests
    // ----------------------------
    it("should create a new order successfully", async () => {
        // mock fetchTableAvailable
        mockedAxios.get.mockResolvedValueOnce({ data: [mockTable] });
        // mock table initialization
        mockedAxios.post.mockResolvedValueOnce({ status: 201, data: mockTableOrder });
        // mock item addition
        mockedAxios.post.mockResolvedValueOnce({ status: 201 });

        const result = await OrderService.createOrder(mockOrder);

        expect(mockedAxios.get).toHaveBeenCalledWith(`${process.env.GATEWAY_SERVICE_URL}${process.env.GATEWAY_ORDER_SERVICE_URL}/tables`);
        expect(mockedAxios.post).toHaveBeenCalledWith(
            `${process.env.GATEWAY_SERVICE_URL}${process.env.GATEWAY_DINING_SERVICE_URL}/1`,
            expect.objectContaining({
                tableNumber: 1,
                customersCount: 2,
            })
        );
        expect(result).toEqual(mockTableOrder);
    });

    it("should throw if table initialization fails", async () => {
        mockedAxios.get.mockResolvedValueOnce({ data: [mockTable] });
        mockedAxios.post.mockResolvedValueOnce({ status: 400 });

        await expect(OrderService.createOrder(mockOrder)).rejects.toThrow(
            /Failed to initialize table/
        );
    });

    it("should throw if adding an item fails", async () => {
        mockedAxios.get.mockResolvedValueOnce({ data: [mockTable] });
        mockedAxios.post
            .mockResolvedValueOnce({ status: 201, data: mockTableOrder })
            .mockResolvedValueOnce({ status: 400 });

        await expect(OrderService.createOrder(mockOrder)).rejects.toThrow(
            /Failed to add item/
        );
    });

    // ----------------------------
    // fetchTableAvailable tests
    // ----------------------------
    it("should return an available table if one exists", async () => {
        mockedAxios.get.mockResolvedValueOnce({
            data: [mockTable, { ...mockTable, number: 2, taken: true }],
        });

        const result = await (OrderService as any).fetchTableAvailable();
        expect(result.number).toBe(1);
    });

    it("should create a new table if none are available", async () => {
        mockedAxios.get.mockResolvedValueOnce({
            data: [{ ...mockTable, taken: true }],
        });
        mockedAxios.post.mockResolvedValueOnce({
            status: 201,
            data: { ...mockTable, number: 2, taken: false },
        });

        const result = await (OrderService as any).fetchTableAvailable();
        expect(result.number).toBe(2);
        expect(mockedAxios.post).toHaveBeenCalledWith(
            `${process.env.GATEWAY_SERVICE_URL}${process.env.GATEWAY_ORDER_SERVICE_URL}/tables`,
            { number: 2 }
        );
    });

    // ----------------------------
    // payOrder tests
    // ----------------------------
    it("should pay an order and start preparation successfully", async () => {
        mockedAxios.post
            .mockResolvedValueOnce({ status: 200, data: mockTableOrder }) // /bill
            .mockResolvedValueOnce({ status: 200, data: { _id: "prep1" } }); // /prepare

        const result = await OrderService.payOrder("123");

        expect(mockedAxios.post).toHaveBeenNthCalledWith(
            1,
            `${process.env.GATEWAY_SERVICE_URL}${process.env.GATEWAY_DINING_SERVICE_URL}/tableOrders/123/bill`
        );
        expect(mockedAxios.post).toHaveBeenNthCalledWith(
            2,
            `${process.env.GATEWAY_SERVICE_URL}${process.env.GATEWAY_DINING_SERVICE_URL}/tableOrders/123/prepare`
        );
        expect(result).toEqual(mockTableOrder);
    });

    it("should throw if paying the order fails", async () => {
        mockedAxios.post.mockResolvedValueOnce({ status: 400 });

        await expect(OrderService.payOrder("123")).rejects.toThrow(
            /Failed to pay order/
        );
    });

    it("should throw if order preparation fails", async () => {
        mockedAxios.post
            .mockResolvedValueOnce({ status: 200, data: mockTableOrder }) // /bill ok
            .mockResolvedValueOnce({ status: 400 }); // /prepare fail

        await expect(OrderService.payOrder("123")).rejects.toThrow(
            /Failed to start order preparation/
        );
    });
});
