import { UserDocument } from "@/models/UserModel";
import updateHashPassword from "@/utils/updateHashPassword";
import { hash } from "bcrypt";

jest.mock("bcrypt");

const mockPassword = "aa123456";
const mockThis = {
  getUpdate: jest.fn().mockReturnValue({
    password: mockPassword,
  }),
} as unknown as UserDocument;
const mockNext = jest.fn();

describe("updateHashPassword function", () => {
  it("Should hash the password if it has been updated", async () => {
    await updateHashPassword.call(mockThis, mockNext);

    expect(hash).toHaveBeenCalledWith(mockPassword, 10);
    expect(mockNext).toHaveBeenCalled();
  });

  it("Should only call the next function if the password has not been changed", async () => {
    const mockThis = {
      getUpdate: jest.fn().mockReturnValue(false),
    } as unknown as UserDocument;

    await updateHashPassword.call(mockThis, mockNext);

    expect(hash).not.toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalled();
  });
});
