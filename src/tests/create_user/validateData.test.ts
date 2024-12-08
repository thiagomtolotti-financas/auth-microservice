import validateData from "@/routes/create_user/validateData";

describe("create_user/validateData", () => {
  it("Should return success if the data contains an email", () => {
    const mockedEmail = "test@test.com";

    const res = validateData({
      email: mockedEmail,
    });

    expect(res.success).toBe(true);
  });

  it("Should return error if the email is invalid", () => {
    const body = {
      email: "test",
    };

    const res = validateData(body);

    expect(res.success).toBe(false);
  });

  it("Should return error if there's extra properties in data", () => {
    const body = {
      email: "test@test.com",
      test: "test",
    };

    const res = validateData(body);

    expect(res.success).toBe(false);
  });

  it("Should return error if there's missing properties in data", () => {
    const body = {};

    const res = validateData(body);

    expect(res.success).toBe(false);
  });
});
