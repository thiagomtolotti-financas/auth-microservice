import { sign } from "jsonwebtoken";
import { User } from "../../models/UserModel";
import generateUserTokens from "../../routes/login/generateUserTokens";
import EXPIRATION_TIME_IN_SECONDS from "../../constants/EXPIRATION_TIME_IN_SECONDS";

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

const mockToken = "7777";
const mockUser = {
  updateOne: jest.fn(),
  id: "1234",
} as unknown as User;

const mockJWTSecret = "4321";
process.env.JWT_SECRET = mockJWTSecret;

describe("login/generateUserTokens function", () => {
  beforeEach(() => {
    (sign as jest.Mock).mockReturnValue(mockToken);
  });

  it("Should return an access_token and a refresh token", async () => {
    const tokens = await generateUserTokens(mockUser);

    expect(mockUser.updateOne).toHaveBeenCalledTimes(1);

    expect(sign).toHaveBeenNthCalledWith(
      1,
      { user_id: mockUser.id },
      mockJWTSecret,
      { expiresIn: EXPIRATION_TIME_IN_SECONDS }
    );
    expect(sign).toHaveBeenNthCalledWith(
      2,
      { user_id: mockUser.id },
      mockJWTSecret
    );

    expect(tokens).toEqual({
      access_token: mockToken,
      refresh_token: mockToken,
    });
  });
});
