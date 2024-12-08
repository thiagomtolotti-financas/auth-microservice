import { UserNotFoundError } from "@/errors";
import handleError from "@/errors/handleError";
import UserModel, { User } from "@/models/UserModel";
import password from "@/routes/password";
import validateCode from "@/routes/password/validateCode";
import validateData from "@/routes/password/validateData";
import { Request, Response } from "express";

jest.mock("@/errors/handleError");
jest.mock("@/routes/password/validateData");
jest.mock("@/routes/password/validateCode");
jest.mock("@/models/UserModel");

const mockedEmail = "test@test.com";
const mockedCode = 1234;
const mockedPassword = "aa123456";

const mockedRequest = {
  body: {},
} as Request;
const mockedResponse = {
  send: jest.fn().mockReturnThis(),
  status: jest.fn().mockReturnThis(),
} as unknown as Response;
const mockedUser = {
  updateOne: jest.fn(),
} as unknown as User;

(validateData as jest.Mock).mockReturnValue({
  success: true,
  data: {
    email: mockedEmail,
    code: mockedCode,
    password: mockedPassword,
  },
});
(UserModel.findOne as jest.Mock).mockReturnValue(mockedUser);

describe("password route", () => {
  it("Should return an error if the data in the body is invalid", async () => {
    (validateData as jest.Mock).mockReturnValueOnce({
      sucess: false,
    });

    await password(mockedRequest, mockedResponse);

    expect(mockedResponse.status).toHaveBeenCalledWith(400);
    expect(mockedResponse.send).toHaveBeenCalledWith("Invalid parameters");
  });

  it("Should validate the user code, update the user and return successful message", async () => {
    await password(mockedRequest, mockedResponse);

    expect(UserModel.findOne).toHaveBeenCalledWith({ email: mockedEmail });
    expect(validateCode).toHaveBeenCalled();
    expect(mockedUser.updateOne).toHaveBeenCalledWith({
      password_code: null,
      password_code_expire_time: null,
      password: mockedPassword,
    });
    expect(mockedResponse.send).toHaveBeenCalledWith(
      "Password set successfully"
    );
  });

  it("Should handle errors while finding the user", async () => {
    (UserModel.findOne as jest.Mock).mockReturnValueOnce(null);

    await password(mockedRequest, mockedResponse);

    expect(handleError).toHaveBeenCalledWith(
      new UserNotFoundError(),
      mockedResponse
    );
  });

  it("Should handle errors while updating the user", async () => {
    (mockedUser.updateOne as jest.Mock).mockImplementationOnce(async () => {
      throw new Error("Test Error");
    });

    await password(mockedRequest, mockedResponse);

    expect(handleError).toHaveBeenCalledWith(
      new Error("Test Error"),
      mockedResponse
    );
  });
});
