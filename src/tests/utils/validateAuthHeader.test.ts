import { UserInactiveError, UserNotFoundError } from "@/errors";
import handleError from "@/errors/handleError";
import { WithUserId } from "@/globals";
import UserModel, { User } from "@/models/UserModel";
import validateAuthHeader from "@/utils/validateAuthHeader";
import { Request, Response } from "express";
import { JsonWebTokenError, TokenExpiredError, verify } from "jsonwebtoken";

jest.mock("jsonwebtoken");
jest.mock("@/models/UserModel");
jest.mock("@/errors/handleError");

const mockAuthHeader = "Bearer 4321";
const mockUserId = "1234";

const mockUser = {
  is_active: true,
} as User;

(verify as jest.Mock).mockReturnValue({ user_id: mockUserId });
(UserModel.findById as jest.Mock).mockReturnValue(mockUser);

const mockRequest = {
  headers: {
    authorization: mockAuthHeader,
  },
} as Request;
const mockResponse = {
  status: jest.fn().mockReturnThis(),
  send: jest.fn().mockReturnThis(),
} as unknown as Response;
const mockNextFunction = jest.fn();

describe("validateAuthHeader middleware function", () => {
  it("Should add user_id to the request if successful", async () => {
    await validateAuthHeader(mockRequest, mockResponse, mockNextFunction);

    expect((mockRequest as Request & WithUserId).user_id).toEqual(mockUserId);
  });

  it("Should call the next function if successful", async () => {
    await validateAuthHeader(mockRequest, mockResponse, mockNextFunction);

    expect(mockNextFunction).toHaveBeenCalled();
  });

  it("Should return with status 401 if the token is invalid", async () => {
    const mockRequest = {
      headers: {
        authorization: "4321",
      },
    } as Request;

    await validateAuthHeader(mockRequest, mockResponse, mockNextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockNextFunction).not.toHaveBeenCalled();
  });

  it("Should call the handleError function if the user can't be found", async () => {
    (UserModel.findById as jest.Mock).mockReturnValue(undefined);

    await validateAuthHeader(mockRequest, mockResponse, mockNextFunction);

    expect(handleError).toHaveBeenCalledWith(
      new UserNotFoundError(),
      mockResponse,
      401
    );
  });
  it("Should call the handleError function if the user is inactive", async () => {
    (UserModel.findById as jest.Mock).mockReturnValue({
      ...mockUser,
      is_active: false,
    });

    await validateAuthHeader(mockRequest, mockResponse, mockNextFunction);

    expect(handleError).toHaveBeenCalledWith(
      new UserInactiveError(),
      mockResponse,
      401
    );
  });

  it("Should return with status 401 if the token can't be verified", async () => {
    (verify as jest.Mock).mockImplementationOnce(() => {
      throw new JsonWebTokenError("Test");
    });

    await validateAuthHeader(mockRequest, mockResponse, mockNextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockNextFunction).not.toHaveBeenCalled();
  });
  it("Should return a 401 status if the token is expired", async () => {
    (verify as jest.Mock).mockImplementationOnce(() => {
      throw new TokenExpiredError("Test", new Date("12-31-2024"));
    });

    await validateAuthHeader(mockRequest, mockResponse, mockNextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockNextFunction).not.toHaveBeenCalled();
  });
});
