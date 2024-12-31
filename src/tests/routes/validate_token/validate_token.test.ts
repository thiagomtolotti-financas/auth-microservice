import { WithUserId } from "@/globals";
import validate_token from "@/routes/validate_token";
import { Request, Response } from "express";

const mockUserId = "1234";
const mockRequest = {
  headers: {
    "x-auth-api-key": "Test",
  },
  user_id: mockUserId,
} as unknown as Request & WithUserId;
const mockResponse = {
  status: jest.fn().mockReturnThis(),
  send: jest.fn(),
} as unknown as Response;

describe("validate_token route", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules(); // Clears the cache
    process.env = { ...OLD_ENV }; // Make a copy
    process.env.API_KEY = "Test";
  });

  afterAll(() => {
    process.env = OLD_ENV; // Restore old environment
  });

  it("Should return 401 if the api key header is wrong", async () => {
    const mockRequest = {
      headers: {
        "x-auth-api-key": "4321",
      },
      user_id: mockUserId,
    } as unknown as Request & WithUserId;

    await validate_token(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
  });

  it("Should return the user's id", async () => {
    await validate_token(mockRequest, mockResponse);

    expect(mockResponse.send).toHaveBeenCalledWith({
      user_id: mockUserId,
    });
  });
});
