import express from "express";
import supertest from "supertest";
import router from "../controller/group.controller";
import groupService from "../service/group.service";
import {GroupOrderRecapDto} from "../dto/group-order-recap.dto";

// Mock the group service
jest.mock("../service/group.service");
const mockedGroupService = groupService as jest.Mocked<typeof groupService>;

describe("Group E2E Tests", () => {
  let app: express.Application;
  let request: any;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use("/group", router);
    request = supertest(app);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /:code/exists", () => {
    it("should return 200 when group exists", async () => {
      mockedGroupService.doesGroupExist.mockReturnValue(true);

      const response = await request
        .get("/group/123456/exists")
        .expect(200);

      expect(mockedGroupService.doesGroupExist).toHaveBeenCalledWith("123456");
    });

    it("should return 404 when group does not exist", async () => {
      mockedGroupService.doesGroupExist.mockReturnValue(false);

      const response = await request
        .get("/group/999999/exists")
        .expect(404);

      expect(mockedGroupService.doesGroupExist).toHaveBeenCalledWith("999999");
    });
  });

  describe("GET /:code/table", () => {
    it("should return table number when group exists", async () => {
      const mockTableNumber = 10;
      mockedGroupService.getTableNumber.mockResolvedValue(mockTableNumber);

      const response = await request
        .get("/group/123456/table")
        .expect(200);

      expect(response.body).toEqual({ tableNumber: mockTableNumber });
      expect(mockedGroupService.getTableNumber).toHaveBeenCalledWith("123456");
    });

    it("should return 404 when group does not exist", async () => {
      mockedGroupService.getTableNumber.mockRejectedValue(new Error("Group not found"));

      await request
        .get("/group/999999/table")
        .expect(500);

      expect(mockedGroupService.getTableNumber).toHaveBeenCalledWith("999999");
    });
  });

  describe("PUT /:code/customers", () => {
    it("should add customers successfully", async () => {
      mockedGroupService.addCustomer.mockResolvedValue();

      const response = await request
        .put("/group/123456/customers")
        .send({ count: 2 })
        .expect(204);

      expect(mockedGroupService.addCustomer).toHaveBeenCalledWith("123456", 2);
    });

    it("should return 400 for invalid count (not integer)", async () => {
      const response = await request
        .put("/group/123456/customers")
        .send({ count: "invalid" })
        .expect(400);

      expect(response.body).toEqual({ error: "count must be a positive integer" });
      expect(mockedGroupService.addCustomer).not.toHaveBeenCalled();
    });

    it("should return 400 for negative count", async () => {
      const response = await request
        .put("/group/123456/customers")
        .send({ count: -1 })
        .expect(400);

      expect(response.body).toEqual({ error: "count must be a positive integer" });
      expect(mockedGroupService.addCustomer).not.toHaveBeenCalled();
    });

    it("should return 400 for zero count", async () => {
      const response = await request
        .put("/group/123456/customers")
        .send({ count: 0 })
        .expect(400);

      expect(response.body).toEqual({ error: "count must be a positive integer" });
      expect(mockedGroupService.addCustomer).not.toHaveBeenCalled();
    });

    it("should handle service errors", async () => {
      mockedGroupService.addCustomer.mockRejectedValue(new Error("Service error"));

      await request
        .put("/group/123456/customers")
        .send({ count: 2 })
        .expect(500);

      expect(mockedGroupService.addCustomer).toHaveBeenCalledWith("123456", 2);
    });
  });

  describe("GET /:code/recap", () => {
    it("should return group recap", async () => {
      const mockRecap: GroupOrderRecapDto = {
        _id: "123456",
        tableNumber: 10,
        expectedCustomers: 4,
        totalpriceToPay: 24,
        actualCustomers: 4,
        menuUnitPrice: 6,
      };
      mockedGroupService.getRecap.mockResolvedValue(mockRecap);

      const response = await request
        .get("/group/123456/recap")
        .expect(200);

      expect(response.body).toEqual(mockRecap);
      expect(mockedGroupService.getRecap).toHaveBeenCalledWith("123456");
    });

    it("should handle service errors", async () => {
      mockedGroupService.getRecap.mockRejectedValue(new Error("Service error"));

      await request
        .get("/group/123456/recap")
        .expect(500);
    });
  });

  describe("PUT /:code/pay", () => {
    it("should process payment successfully", async () => {
      mockedGroupService.pay.mockResolvedValue();

      const response = await request
        .put("/group/123456/pay")
        .expect(204);

      expect(mockedGroupService.pay).toHaveBeenCalledWith("123456");
    });

    it("should handle payment errors", async () => {
      mockedGroupService.pay.mockRejectedValue(new Error("Payment failed"));

      await request
        .put("/group/123456/pay")
        .expect(500);
    });
  });
});
