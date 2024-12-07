import validateBody from "../../routes/login/validateBody";

describe("login/validateBody function", () => {
  it("Should return success for a valid body", () => {
    const body = {
      email: "test@test.com",
      password: "aa123456",
    };

    const res = validateBody(body);

    expect(res.success).toBe(true);
    expect(res.data).toEqual(body);
  });

  it("Should return error if the email is invalid", () => {
    const body = {
      email: "test",
      password: "aa123456",
    };

    const res = validateBody(body);

    expect(res.success).toBe(false);
  });

  it("Should return error if the password is invalid", () => {
    const body = {
      email: "test@test.com",
      password: "123456",
    };

    const res = validateBody(body);

    expect(res.success).toBe(false);
  });

  it("Should return error if there's extra properties in body", () => {
    const body = {
      email: "test@test.com",
      password: "aa123456",
      test: "test",
    };

    const res = validateBody(body);

    expect(res.success).toBe(false);
  });

  it("Should return error if there's missing properties in body", () => {
    const body = {
      email: "test@test.com",
    };

    const res = validateBody(body);

    expect(res.success).toBe(false);
  });
});
