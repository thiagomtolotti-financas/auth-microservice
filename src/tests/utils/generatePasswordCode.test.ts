import generatePasswordCode from "@/utils/generatePasswordCode";

describe("generatePasswordCode function", () => {
  it("Should return a code and an expire time", () => {
    const result = generatePasswordCode();

    expect(result).toHaveProperty("code");
    expect(result).toHaveProperty("expireTime");
  });

  it("Should return a code between 1000 and 9000", () => {
    const result = generatePasswordCode();
    const { code } = result;

    expect(code).toBeGreaterThanOrEqual(1000);
    expect(code).toBeLessThan(9000);
  });

  it("Should return the expire time with one hour from now", () => {
    const now = Date.now();
    const oneHour = 1000 * 60 * 60;
    const result = generatePasswordCode();

    // Allow slight delay margin
    expect(result.expireTime).toBeGreaterThanOrEqual(now + oneHour - 10);
    expect(result.expireTime).toBeLessThanOrEqual(now + oneHour + 10);
  });
});
