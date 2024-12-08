import { Request, Response } from "express";

import findUser from "@/routes/login/findUser";
import generateUserTokens from "@/routes/login/generateUserTokens";
import login from "@/routes/login";
import handleError from "@/errors/handleError";
import routesSchemas from "@/schemas/routesSchemas";

jest.mock("@/routes/login/findUser");
jest.mock("@/routes/login/generateUserTokens");
jest.mock("@/errors/handleError");
jest.mock("@/schemas/routesSchemas");

const mockEmail = "test@test.com";
const mockPassword = "test";

const mockRequest = {
  body: {
    email: mockEmail,
    password: mockPassword,
  },
} as Request;

const mockResponse = {
  send: jest.fn(),
  status: jest.fn().mockReturnThis(),
} as unknown as Response;

const mockAccessToken = "access_token";
const mockRefreshToken = "refresh_token";

(routesSchemas.login.safeParse as jest.Mock).mockReturnValue({
  success: true,
  data: {
    email: mockEmail,
    password: mockPassword,
  },
});
(findUser as jest.Mock).mockReturnValue({
  email: mockEmail,
});
(generateUserTokens as jest.Mock).mockReturnValue({
  access_token: mockAccessToken,
  refresh_token: mockRefreshToken,
});

describe("Login route", () => {
  it("Should return the user email and tokens if the login is successful", async () => {
    await login(mockRequest, mockResponse);

    expect(routesSchemas.login.safeParse).toHaveBeenCalledWith(
      mockRequest.body
    );
    expect(findUser).toHaveBeenCalledWith(mockEmail, mockPassword);
    expect(generateUserTokens).toHaveBeenCalledWith({
      email: mockEmail,
    });

    expect(mockResponse.send).toHaveBeenCalledWith({
      access_token: mockAccessToken,
      refresh_token: mockRefreshToken,
      email: mockEmail,
    });
  });

  it("Should return an 400 error and an 'Invalid Parameters' if the body is not valid", async () => {
    (routesSchemas.login.safeParse as jest.Mock).mockReturnValueOnce({
      success: false,
    });

    await login(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.send).toHaveBeenCalledWith("Invalid parameters");
  });

  it("Should call the handleError function if can't find the user", async () => {
    (findUser as jest.Mock).mockImplementationOnce(() => {
      throw new Error("Find User Error");
    });

    await login(mockRequest, mockResponse);

    expect(handleError).toHaveBeenCalledWith(
      new Error("Find User Error"),
      mockResponse
    );
  });

  it("Should call the handleError function if can't generate the user tokens", async () => {
    (generateUserTokens as jest.Mock).mockImplementationOnce(() => {
      throw new Error("Generate Token Error");
    });

    await login(mockRequest, mockResponse);

    expect(handleError).toHaveBeenCalledWith(
      new Error("Generate Token Error"),
      mockResponse
    );
  });
});
