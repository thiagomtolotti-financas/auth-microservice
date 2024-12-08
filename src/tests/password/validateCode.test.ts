import { ExpiredCodeError, InvalidCodeError } from "@/errors";
import { User } from "@/models/UserModel";
import validateCode from "@/routes/password/validateCode";

const mockedUser = {
  password_code: "1234",
  password_code_expire_time: new Date("2024-12-08"),
} as unknown as User;

jest.useFakeTimers().setSystemTime(new Date("2024-12-07"));

describe("password/validateCode", () => {
  it("Should return nothing if everything is right", () => {
    validateCode(mockedUser, "1234");
  });

  it("Should throw an error if the user code is different from the given code", () => {
    try {
      validateCode(mockedUser, "4321");
    } catch (err) {
      expect(err).toBeInstanceOf(InvalidCodeError);
    }
  });

  it("Should throw an error if the user doesn't have a code expire time", () => {
    const mockedUser = {
      password_code: "1234",
    } as unknown as User;

    try {
      validateCode(mockedUser, "1234");
    } catch (err) {
      expect(err).toBeInstanceOf(ExpiredCodeError);
    }
  });

  it("Should throw an error if the user code expire time is past", () => {
    jest.useFakeTimers().setSystemTime(new Date("2024-12-09"));

    try {
      validateCode(mockedUser, "1234");
    } catch (err) {
      expect(err).toBeInstanceOf(ExpiredCodeError);
    }
  });
});
