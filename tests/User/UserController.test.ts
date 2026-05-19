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
  var userCreatedId: number;  

  const user = {
    body: {
      username: "JoGoRu",
      email: "johann.ruth@gmail.com",
      password: "senha1234",
      confirmPassword: "senha1234",
      fullName: "Johann Gossen Ruth",
    },
    session: {
        user: { id: 1 }
    },
    flash: vi.fn() 
  };
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
    redirect: vi.fn(),
  };
  
  it("should create a valid user", async () => {


    expect(user).not.toBeFalsy();

    const createdUser = await userController.register(user, res);
    const userCreated = await userController.findByUsername(user.body.username);
    userCreatedId = userCreated?.id;
    expect(userCreated).not.toBeFalsy();
  });

  it("should update the created user", async () => {
    
    user.body.fullName = "Johann Gossen Ruth Updated";

    await userController.updateProfile(user, res);

    const afterUpdateUser = await userController.findByUsername(user.body.username);

    expect(afterUpdateUser?.fullName).toBe(user.body.fullName);
  })

});