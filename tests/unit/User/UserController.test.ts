import { describe, it, expect, vi, beforeEach } from "vitest";
require("../../configuration/associations");
import * as userController from "../../../modules/users/userController";

describe("UserController", () => {
  var req: any;

  beforeEach(() => {
    req = {
      body: {
        username: "teste",
        password: "password123",
        confirmPassword: "password123",
        email: "teste@teste.com",
        login: "teste@teste.com",
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
      const user = await userController.findByUsername("teste");
      expect(user).not.toBeNull();
      expect(user?.username).toBe("teste");
    });
  
  it("should get user by username", async () => {
    const user = await userController.findByUsername("teste");
    expect(user).not.toBeNull();
    expect(user?.username).toBe("teste");
  });

  it("should login user", async () => {
    const user = await userController.login(req);
    expect(req.session.user).not.toBeNull();
    expect(req.session.user.username).toBe("teste");
  });

  it("should update user profile", async () => {
    req.body.fullName = "Teste User UPDATE";
    
    await userController.updateProfile(req);
    const user = await userController.findByUsername("teste");
    expect(user).not.toBeNull();
    expect(user.fullName).toBe("Teste User UPDATE");
  });

});