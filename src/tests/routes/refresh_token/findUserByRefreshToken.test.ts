import { InvalidTokenError, UserNotFoundError } from "@/errors";
import UserModel from "@/models/UserModel";
import findUserByRefreshToken from "@/routes/refresh_token/findUserByRefreshToken";
import { verify } from "jsonwebtoken";

jest.mock("jsonwebtoken");
jest.mock("@/models/UserModel");

const mockedUserId = "1234";
const mockedToken = "4321";
const mockedUser = {
  id: mockedUserId,
  refresh_token: mockedToken,
};

(verify as jest.Mock).mockReturnValue(mockedUserId);
(UserModel.findById as jest.Mock).mockReturnValue(mockedUser);

describe("refresh_token/findUserByRefreshToken function", () => {
  it("Should return the user found given it's refresh token", async () => {
    const user = await findUserByRefreshToken(mockedToken);

    expect(user).toEqual(mockedUser);
  });

  it("Should throw an error if the user can't be found", async () => {
    (UserModel.findById as jest.Mock).mockReturnValueOnce(null);

    try {
      await findUserByRefreshToken(mockedToken);

      throw new Error("Test should throw error");
    } catch (err) {
      expect(err).toBeInstanceOf(UserNotFoundError);
    }
  });

  it("Should throw an error if the provided token is not the same as the user token", async () => {
    try {
      await findUserByRefreshToken("12345");

      throw new Error("Test should throw error");
    } catch (err) {
      expect(err).toBeInstanceOf(InvalidTokenError);
    }
  });
});
