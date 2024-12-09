import { UserNotFoundError } from "@/errors";
import UserModel, { User } from "@/models/UserModel";
import updateUserPassword from "@/routes/change_password/updateUserPassword";

jest.mock("@/models/UserModel");

const mockedUser = {
  updateOne: jest.fn(),
} as unknown as User;

(UserModel.findById as jest.Mock).mockReturnValue(mockedUser);

const mockedUserId = "1234";
const mockedNewPassword = "aa123456";

describe("updateUserPassword function", () => {
  it("Should throw an error if the user is not found", async () => {
    (UserModel.findById as jest.Mock).mockReturnValueOnce(null);

    try {
      await updateUserPassword(mockedUserId, mockedNewPassword);

      throw new Error("Test should throw error");
    } catch (err) {
      expect(err).toBeInstanceOf(UserNotFoundError);
    }
  });

  it("Should update the user with the new password", async () => {
    await updateUserPassword(mockedUserId, mockedNewPassword);

    expect(mockedUser.updateOne).toHaveBeenCalledWith({
      password: mockedNewPassword,
    });
  });
});
