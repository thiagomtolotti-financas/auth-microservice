import { UserAlreadyExistsError } from "@/errors";
import UserModel from "@/models/UserModel";
import createUserInDB from "@/routes/create_user/createUserInDB";
import generatePasswordCode from "@/utils/generatePasswordCode";

jest.mock("@/models/UserModel");
jest.mock("@/utils/generatePasswordCode");

const mockedEmail = "test@test.com";
const mockedCode = 1234;
const mockedExpireTime = 13200;
const mockedUser = {
  save: jest.fn(),
};

(UserModel.create as jest.Mock).mockReturnValue(mockedUser);

(generatePasswordCode as jest.Mock).mockReturnValue({
  code: mockedCode,
  expireTime: mockedExpireTime,
});

class DBError extends Error {
  public code = 11000;

  constructor() {
    super("User Found in DB");
  }
}

describe("create_user/createUserInDB function", () => {
  it("Should save and return the newly created user", async () => {
    const res = await createUserInDB(mockedEmail);

    expect(UserModel.create).toHaveBeenCalledWith({
      email: mockedEmail,
      password_code: mockedCode,
      password_code_expire_time: mockedExpireTime,
    });
    expect(mockedUser.save).toHaveBeenCalled();

    expect(res).toEqual(mockedUser);
  });

  it("Should throw an specific error if the user already exists in DB", async () => {
    (UserModel.create as jest.Mock).mockImplementationOnce(() => {
      throw new DBError();
    });

    try {
      await createUserInDB(mockedEmail);

      throw new Error("Test Should throw Error");
    } catch (err) {
      expect(err).toBeInstanceOf(UserAlreadyExistsError);
    }
  });

  it("Should rethrow other errors", async () => {
    (UserModel.create as jest.Mock).mockImplementationOnce(() => {
      throw new Error("Mocked Error");
    });

    try {
      await createUserInDB(mockedEmail);

      throw new Error("Test Should throw Error");
    } catch (err) {
      expect(err).toEqual(new Error("Mocked Error"));
    }
  });
});
