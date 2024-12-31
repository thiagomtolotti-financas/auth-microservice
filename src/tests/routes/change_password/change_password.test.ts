import handleError from "@/errors/handleError";
import { WithUserId } from "@/globals";
import change_password from "@/routes/change_password";
import updateUserPassword from "@/routes/change_password/updateUserPassword";
import routesSchemas from "@/schemas/routesSchemas";
import { Request, Response } from "express";
import { verify } from "jsonwebtoken";

jest.mock("@/schemas/routesSchemas");
jest.mock("jsonwebtoken");
jest.mock("@/errors/handleError");
jest.mock("@/routes/change_password/updateUserPassword");

(routesSchemas.change_password.safeParse as jest.Mock).mockReturnValue({
  success: true,
  data: {
    password: "aa123456",
  },
});
(verify as jest.Mock).mockReturnValue({
  user_id: "1234",
});

const mockRequest = {
  headers: {
    authorization: "1234",
  },
} as Request & WithUserId;
const mockResponse = {
  status: jest.fn().mockReturnThis(),
  send: jest.fn().mockReturnThis(),
} as unknown as Response;

describe("change_password route", () => {
  it("Should return an error if it can't parse the body", async () => {
    (routesSchemas.change_password.safeParse as jest.Mock).mockReturnValueOnce({
      success: false,
    });

    await change_password(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
  });

  it("Should handle any errors while updating the password", async () => {
    (updateUserPassword as jest.Mock).mockImplementationOnce(() => {
      throw new Error("Test Error");
    });

    await change_password(mockRequest, mockResponse);

    expect(handleError).toHaveBeenCalledWith(
      new Error("Test Error"),
      mockResponse
    );
  });

  it("Should return a message if everything goes right", async () => {
    await change_password(mockRequest, mockResponse);

    expect(mockResponse.send).toHaveBeenCalledWith(
      "Password changed successfully"
    );
  });
});
