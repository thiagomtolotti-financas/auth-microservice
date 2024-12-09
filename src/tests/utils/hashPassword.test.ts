import { UserDocument } from "@/models/UserModel";
import hashPassword from "@/utils/hashPassword";
import { hash } from "bcrypt";

jest.mock("bcrypt");

const mockPassword = "123456";

const mockThis = {
  password: mockPassword,
  isModified: jest.fn().mockReturnValue(true),
} as unknown as UserDocument;

const mockNext = jest.fn();

describe("hashPassword function", () => {
  it("Should hash the password if is changed", async () => {
    await hashPassword.call(mockThis, mockNext);

    expect(hash).toHaveBeenCalledWith(mockPassword, 10);
    expect(mockNext).toHaveBeenCalled();
  });

  it("Should only call the next function if the password is not changed", async () => {
    const mockThis = {
      password: mockPassword,
      isModified: jest.fn().mockReturnValue(false),
    } as unknown as UserDocument;

    await hashPassword.call(mockThis, mockNext);

    expect(hash).not.toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalled();
  });
});
