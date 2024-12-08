import { User } from "@/models/UserModel";
import resetPassword from "@/routes/forgot_password_email/resetPassword";
import generatePasswordCode from "@/utils/generatePasswordCode";

jest.mock("@/utils/generatePasswordCode");

const mockedCode = 1234;
const mockedExpireTime = 13200;

(generatePasswordCode as jest.Mock).mockReturnValue({
  code: mockedCode,
  expireTime: mockedExpireTime,
});

const mockedUser = {
  updateOne: jest.fn(),
} as unknown as User;

describe("forgot_password_email/resetPassword function", () => {
  it("Should return the generated code and it's expire time", async () => {
    const res = await resetPassword(mockedUser);

    expect(res).toEqual({
      code: mockedCode,
      expireTime: mockedExpireTime,
    });
  });

  it("Should update the user with the code and expire time", async () => {
    await resetPassword(mockedUser);

    expect(mockedUser.updateOne).toHaveBeenCalledWith({
      password_code: mockedCode,
      password_code_expire_time: mockedExpireTime,
    });
  });
});
