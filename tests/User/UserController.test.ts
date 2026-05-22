import { describe, it, expect, vi, beforeEach } from "vitest";
import * as userController from "../../modules/users/userController";

vi.mock("sequelize", () => ({
  DataTypes: {},
  literal: vi.fn(), 
}));

vi.mock("../../config/database", () => ({
  default: {},
}));

describe("UserController", () => {
  var req: any;

  beforeEach(() => {
    req = {
      body: {
        username: "teste",
        password: "password123",
        confirmPassword: "password123",
        email: "teste@teste.com",
        fullName: "Teste User"
      },
      session: {
        user: { id: 1 }
      },
      flash: vi.fn() 
    };
  });
  
    it("should register a new user", async () => {
      const newUser = await userController.register(req);
      expect(newUser).not.toBeFalsy();
      expect(newUser?.username).toBe("teste");
    });
  
  it("should get user by username", async () => {
    const user = await userController.findByUsername("teste");
    expect(user).not.toBeFalsy();
    expect(user?.username).toBe("teste");
  });

  it("should login user", async () => {
    const user = await userController.login(req);
    expect(user).not.toBeFalsy();
    expect(user?.username).toBe("teste");
  });

  it("should update user profile", async () => {
    req.body.username = "Teste UPDATE";
    
    const updatedUser = await userController.updateProfile(req);
    expect(updatedUser).not.toBeFalsy();
    expect(updatedUser?.username).toBe("Teste UPDATE");
  }

});