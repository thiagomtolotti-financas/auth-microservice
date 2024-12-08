import UserModel from "@/models/UserModel";
import forgot_password_email from "@/routes/forgot_password_email";
import resetPassword from "@/routes/forgot_password_email/resetPassword";
import { Request, Response } from "express";
import sendgrid from "@sendgrid/mail";
import handleError from "@/errors/handleError";
import { UserNotFoundError } from "@/errors";
import routesSchemas from "@/schemas/routesSchemas";

jest.mock("@sendgrid/mail");
jest.mock("@/models/UserModel");
jest.mock("@/schemas/routesSchemas");
jest.mock("@/routes/forgot_password_email/resetPassword");
jest.mock("@/errors/handleError");

const mockedRequest = {} as Request;
const mockedResponse = {
  send: jest.fn().mockReturnThis(),
  status: jest.fn().mockReturnThis(),
} as unknown as Response;

const mockedCode = 1234;
const mockedEmail = "test@test.com";

(routesSchemas.forgot_password_email.safeParse as jest.Mock).mockReturnValue({
  success: true,
  data: {
    email: mockedEmail,
  },
});
(UserModel.findOne as jest.Mock).mockReturnValue({
  email: mockedEmail,
});
(resetPassword as jest.Mock).mockReturnValue({
  code: mockedCode,
});

describe("forgot_password_email route", () => {
  it("Should return an error if the parameters are invalid", async () => {
    (
      routesSchemas.forgot_password_email.safeParse as jest.Mock
    ).mockReturnValueOnce({
      success: false,
    });

    await forgot_password_email(mockedRequest, mockedResponse);

    expect(mockedResponse.status).toHaveBeenCalledWith(400);
    expect(mockedResponse.send).toHaveBeenCalledWith("Invalid parameters");
  });

  it("Should send an email to the user and return successfully", async () => {
    await forgot_password_email(mockedRequest, mockedResponse);

    expect(UserModel.findOne).toHaveBeenCalledWith({ email: mockedEmail });
    expect(sendgrid.send).toHaveBeenCalled();

    expect(mockedResponse.send).toHaveBeenCalledWith("Email sent successfully");
  });

  it("Should handle errors when finding the user", async () => {
    (UserModel.findOne as jest.Mock).mockReturnValueOnce(null);

    await forgot_password_email(mockedRequest, mockedResponse);

    expect(handleError).toHaveBeenCalledWith(
      new UserNotFoundError(),
      mockedResponse
    );
  });

  it("Should handle errors while reseting the password", async () => {
    (resetPassword as jest.Mock).mockImplementationOnce(() => {
      throw new Error("Test Error");
    });

    await forgot_password_email(mockedRequest, mockedResponse);

    expect(handleError).toHaveBeenCalledWith(
      new Error("Test Error"),
      mockedResponse
    );
  });

  it("Should handle errors while sending the email", async () => {
    (sendgrid.send as jest.Mock).mockImplementationOnce(() => {
      throw new Error("Test Error");
    });

    await forgot_password_email(mockedRequest, mockedResponse);

    expect(handleError).toHaveBeenCalledWith(
      new Error("Test Error"),
      mockedResponse
    );
  });
});
