import validateData from "@/routes/refresh_token/validateData";

const mockedToken = "1234";

describe("refresh_token/validateData function", () => {
  it("Should validate a data with a refresh_token", () => {
    const res = validateData({
      refresh_token: mockedToken,
    });

    expect(res.success).toBe(true);
  });

  it("Should return error if the refresh_token is not a string", () => {
    const res = validateData({
      refresh_token: 1234,
    });

    expect(res.success).toBe(false);
  });

  it("Should return error if there's extra fields in the data", () => {
    const res = validateData({
      refresh_token: mockedToken,
      access_token: "4321",
    });

    expect(res.success).toBe(false);
  });

  it("Should return error if is missing the refresh_token", () => {
    const res = validateData({});

    expect(res.success).toBe(false);
  });
});
