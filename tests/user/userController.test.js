const { describe, it, expect } = require("vitest");

describe("Register", () => {
  const password = "myPassword";
  const confirmPassword = "myPassword";

  it("both password should be equal", () => {
    expect(password).toBe(confirmPassword);
  })
});