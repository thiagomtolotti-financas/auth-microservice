import {
  InvalidEmailOrPasswordError,
  PasswordNotRegisteredError,
  UserNotFoundError,
} from "../../errors";
import UserModel from "../../models/UserModel";
import findUser from "../../routes/login/findUser";

const mockEmail = "test@test.com";
const mockPassword = "aa123456";

jest.mock("bcrypt", () => ({
  compare: jest.fn().mockReturnValue(true),
}));
jest.mock("../../models/UserModel");

describe("login/findUser", () => {
  beforeEach(() => {
    (UserModel.findOne as jest.Mock).mockReturnValue({
      email: mockEmail,
      password: mockPassword,
    });
  });

  it("Should return the user if finds an user with the email and matching password", async () => {
    const user = await findUser(mockEmail, mockPassword);

    expect(user.email).toBe(mockEmail);
    expect(user.password).toBe(mockPassword);
  });

  it("Should throw an error if doesn't find a user with the given email", async () => {
    (UserModel.findOne as jest.Mock).mockReturnValueOnce(false);

    try {
      await findUser(mockEmail, mockPassword);
    } catch (err) {
      expect(err).toBeInstanceOf(UserNotFoundError);
    }
  });

  it("Should throw an error if the user doesn't have a registered password", async () => {
    (UserModel.findOne as jest.Mock).mockReturnValueOnce({
      email: mockEmail,
      password: null,
    });

    try {
      await findUser(mockEmail, mockPassword);
    } catch (err) {
      expect(err).toBeInstanceOf(PasswordNotRegisteredError);
    }
  });

  it("Should throw an error if the passwords don't match", async () => {
    (UserModel.findOne as jest.Mock).mockReturnValueOnce({
      email: mockEmail,
      password: "null",
    });

    try {
      await findUser(mockEmail, mockPassword);
    } catch (err) {
      expect(err).toBeInstanceOf(InvalidEmailOrPasswordError);
    }
  });
});
