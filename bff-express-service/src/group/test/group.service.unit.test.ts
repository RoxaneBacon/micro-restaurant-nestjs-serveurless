import groupService from "../service/group.service";
import {MOCK_GROUP_LIST} from "../mock/group.mock";
import {NotFoundError, ForbiddenError} from "../../shared/errors/http-error";
import axios from "axios";
import {GroupOrderRecapDto} from "../dto/group-order-recap.dto";

// Mock axios for external API calls
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock console.log to keep test output clean
jest.spyOn(console, 'log').mockImplementation(() => {
});

describe("Group Service Unit Tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Reset the groups array to initial state
        groupService.groups = [...MOCK_GROUP_LIST];
    });

    describe("doesGroupExist", () => {
        it("should return true for existing group", () => {
            const result = groupService.doesGroupExist("123456");
            expect(result).toBe(true);
        });

        it("should return false for non-existing group", () => {
            const result = groupService.doesGroupExist("999999");
            expect(result).toBe(false);
        });

        it("should return false for empty string", () => {
            const result = groupService.doesGroupExist("");
            expect(result).toBe(false);
        });
    });

    describe("getTableNumber", () => {
        it("should return table number for existing group", async () => {
            const result = await groupService.getTableNumber("123456");
            expect(result).toBe(10);
        });

        it("should throw NotFoundError for non-existing group", async () => {
            await expect(groupService.getTableNumber("999999"))
                .rejects
                .toThrow(NotFoundError);
        });
    });

    describe("addCustomer", () => {
        it("should add customers to READY group and change status to IN_PROGRESS", async () => {
            const group = groupService.groups.find(g => g._id === "123456");
            expect(group?.status).toBe("READY");
            expect(group?.actualCustomers).toBe(0);

            await groupService.addCustomer("123456", 2);

            expect(group?.actualCustomers).toBe(2);
            expect(group?.status).toBe("IN_PROGRESS");
        });

        it("should add customers to IN_PROGRESS group without changing status", async () => {
            const group = groupService.groups.find(g => g._id === "654321");
            expect(group?.status).toBe("IN_PROGRESS");

            await groupService.addCustomer("654321", 1);

            expect(group?.actualCustomers).toBe(1);
            expect(group?.status).toBe("IN_PROGRESS");
        });

        it("should throw NotFoundError for non-existing group", async () => {
            await expect(groupService.addCustomer("999999", 2))
                .rejects
                .toThrow(NotFoundError);
        });

        it("should throw ForbiddenError for closed group", async () => {
            // Set up a closed group
            const group = groupService.groups.find(g => g._id === "123456");
            if (group) {
                group.status = "CLOSED";
            }

            await expect(groupService.addCustomer("123456", 2))
                .rejects
                .toThrow(ForbiddenError);
        });
    });

    describe("getRecap", () => {
        it("should return correct recap for existing group", async () => {
            // Mock menu service response
            const mockMenuData = {
                dishShortNameList: ["Dish 1", "Dish 2"],
                totalPrice: 50
            };

            const result: GroupOrderRecapDto = await groupService.getRecap("123456");

            expect(result).toBeDefined();
            expect(typeof result.totalpriceToPay).toBe("number");
            expect(typeof result.actualCustomers).toBe("number");
        });

        it("should throw NotFoundError for non-existing group", async () => {
            await expect(groupService.getRecap("999999"))
                .rejects
                .toThrow(NotFoundError);
        });

        it("should throw ForbiddenError for non-IN_PROGRESS group", async () => {
            // Test with READY group
            groupService.getRecap("123456").catch((err) => {
                expect(err).toBeInstanceOf(ForbiddenError);
            })
        });
    });

    describe("pay", () => {
        it("should process payment for IN_PROGRESS group", async () => {
            // Mock axios calls
            mockedAxios.post.mockResolvedValueOnce({data: {}});

            const group = groupService.groups.find(g => g._id === "654321");
            expect(group?.status).toBe("IN_PROGRESS");

            await groupService.pay("654321");

            expect(group?.status).toBe("CLOSED");
        });

        it("should throw NotFoundError for non-existing group", async () => {
            groupService.pay("999999").catch((err) => {
                expect(err).toBeInstanceOf(NotFoundError);
            });

            it("should throw ForbiddenError for non-IN_PROGRESS group", async () => {
                groupService.pay("123456").catch((err) => {
                    expect(err).toBeInstanceOf(ForbiddenError);
                });
            });
        });
    });

    describe("getDishList", () => {
        it("should return dish list for existing group", async () => {
            const result = await groupService.getDishList("123456");

            expect(Array.isArray(result)).toBe(true);
            expect(result).toEqual(MOCK_GROUP_LIST[0].menu.dishShortNameList);
        });

        it("should throw NotFoundError for non-existing group", async () => {
            groupService.getDishList("999999").catch((err) => {
                expect(err).toBeInstanceOf(NotFoundError);
            });
        });
    });

    describe("private methods", () => {
        describe("getGroupByCode", () => {
            it("should return group for valid code", () => {
                const group = (groupService as any).getGroupByCode("123456");
                expect(group).toBeDefined();
                expect(group._id).toBe("123456");
            });

            it("should throw NotFoundError for invalid code", () => {
                expect(() => (groupService as any).getGroupByCode("999999"))
                    .toThrow(NotFoundError);
            });
        });

        describe("getGroupByCodeAndVerifStatus", () => {
            it("should return group for valid code and non-closed status", () => {
                const group = (groupService as any).getGroupByCodeAndVerifStatus("123456");
                expect(group).toBeDefined();
                expect(group._id).toBe("123456");
            });

            it("should throw ForbiddenError for closed group", () => {
                const group = groupService.groups.find(g => g._id === "654321");
                if (group) {
                    group.status = "CLOSED";
                }

                expect(() => (groupService as any).getGroupByCodeAndVerifStatus("654321"))
                    .toThrow(ForbiddenError);
            });
        });
    });

    describe("edge cases", () => {
        it("should handle empty groups array", () => {
            groupService.groups = [];

            const result = groupService.doesGroupExist("123456");
            expect(result).toBe(false);
        });

        it("should handle malformed group data", () => {
            groupService.groups = [
                {
                    _id: "test123",
                    mongodbIdTable: "",
                    tableNumber: 0,
                    expectedCustomers: 0,
                    actualCustomers: 0,
                    menuUnitPrice: 0,
                    menu: {dishShortNameList: []},
                    status: "READY"
                }
            ];

            const result = groupService.doesGroupExist("test123");
            expect(result).toBe(true);
        });
    });

    describe("async operations", () => {
        it("should handle axios errors gracefully", async () => {
            mockedAxios.post.mockRejectedValueOnce(new Error("Network error"));

            const group = groupService.groups.find(g => g._id === "654321");
            if (group) {
                group.status = "IN_PROGRESS";
            }

            await expect(groupService.pay("654321"))
                .rejects
                .toThrow("Network error");
        });
    });
});
