import handleError from "@/errors/handleError";
import refresh_token from "@/routes/refresh_token";
import findUserByRefreshToken from "@/routes/refresh_token/findUserByRefreshToken";
import refreshTokenSchema from "@/schemas/zod/refreshTokenSchema";
import { Request, Response } from "express";
import { sign } from "jsonwebtoken";

jest.mock("@/errors/handleError");
jest.mock("@/routes/refresh_token/findUserByRefreshToken");
jest.mock("jsonwebtoken");
jest.mock("@/schemas/zod/refreshTokenSchema");

(refreshTokenSchema.safeParse as jest.Mock).mockReturnValue({
  success: true,
  data: {},
});
(findUserByRefreshToken as jest.Mock).mockReturnValue({
  user: {
    id: "1234",
  },
});
const mockedToken = "4321";
(sign as jest.Mock).mockReturnValue(mockedToken);

const mockedRequest = {} as Request;

const mockedResponse = {
  status: jest.fn().mockReturnThis(),
  send: jest.fn(),
} as unknown as Response;

describe("refresh_token route", () => {
  it("Should return an access_token if everything goes right", async () => {
    await refresh_token(mockedRequest, mockedResponse);

    expect(mockedResponse.send).toHaveBeenCalledWith({
      access_token: mockedToken,
    });
  });

  it("Should return a 401 Invalid Data if the validation is not successful", async () => {
    (refreshTokenSchema.safeParse as jest.Mock).mockReturnValueOnce({
      success: false,
    });

    await refresh_token(mockedRequest, mockedResponse);

    expect(mockedResponse.status).toHaveBeenCalledWith(401);
    expect(mockedResponse.send).toHaveBeenCalledWith("Invalid Data");
  });

  it("Should handle any error that occurs while finding the user", async () => {
    (findUserByRefreshToken as jest.Mock).mockImplementationOnce(() => {
      throw new Error("Find User Error");
    });

    await refresh_token(mockedRequest, mockedResponse);

    expect(handleError).toHaveBeenCalledWith(
      new Error("Find User Error"),
      mockedResponse
    );
  });
});
