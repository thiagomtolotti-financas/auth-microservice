import create_user from "@/routes/create_user";
import createUserInDB from "@/routes/create_user/createUserInDB";
import { Request, Response } from "express";
import sendgrid from "@sendgrid/mail";
import handleError from "@/errors/handleError";
import routesSchemas from "@/schemas/routesSchemas";

jest.mock("@sendgrid/mail");
jest.mock("@/routes/create_user/createUserInDB");
jest.mock("@/schemas/routesSchemas");
jest.mock("@/errors/handleError");

const mockEmail = "test@test.com";
const mockCode = 1234;

const mockRequest = {} as Request;
const mockResponse = {
  send: jest.fn(),
  status: jest.fn().mockReturnThis(),
} as unknown as Response;

(routesSchemas.create_user.safeParse as jest.Mock).mockReturnValue({
  success: true,
  data: {
    email: mockEmail,
  },
});

(createUserInDB as jest.Mock).mockReturnValue({
  email: mockEmail,
  code: mockCode,
});

describe("create_user route", () => {
  it("Should create an user successfuly", async () => {
    await create_user(mockRequest, mockResponse);

    expect(createUserInDB).toHaveBeenCalled();
    expect(mockResponse.send).toHaveBeenCalledWith(
      "An email with the code for creating the password was sent!"
    );
  });

  it("Should return an error if can't validate the data", async () => {
    (routesSchemas.create_user.safeParse as jest.Mock).mockReturnValueOnce({
      success: false,
    });

    await create_user(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.send).toHaveBeenCalledWith("Invalid parameters");
  });

  it("Should send an email to the registered error", async () => {
    await create_user(mockRequest, mockResponse);

    expect(sendgrid.send).toHaveBeenCalled();
  });

  it("Should handle any error while creating the user", async () => {
    (createUserInDB as jest.Mock).mockImplementationOnce(() => {
      throw new Error("Test Error");
    });

    await create_user(mockRequest, mockResponse);

    expect(handleError).toHaveBeenCalledWith(
      new Error("Test Error"),
      mockResponse
    );
  });
});
