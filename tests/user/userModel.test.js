import { describe, expect, it, vi } from "vitest";
import User from "../../modules/users/userModel";

vi.mock("sequelize", () => ({
  DataTypes: {}
}));

vi.mock("../../configuration/database.js", () => ({}));

describe("User Model", () => {
  it("should create a valid user", () => {
    const user = new User({
      username: "gfloriano",
      email: "gflorianodev@gmail.com",
      password: "vitest"
    })

    expect(user.username).toBe("gfloriano");
  })

  it("should receive a valid e-mail address", () => {
    const user = new User({
      username: "gfloriano",
      email: "gflorianodev@gmail.com",
      password: "vitest"
    })

    expect(user.email).not.toBeNull();
    expect(user.email).not.toBeUndefined();
    expect(user.email).toContain("@");
    expect(user.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  })

  it("should receive a valid password", () => {
      const user = new User({
      username: "gfloriano",
      email: "gflorianodev@gmail.com",
      password: "vitest"
    })

    expect(user.password.length).toBeGreaterThanOrEqual(6);
  })
});