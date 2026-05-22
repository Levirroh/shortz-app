import { describe, it, expect, vi, beforeEach } from "vitest";
import User from "../../modules/users/userModel";
const bcrypt = require('bcryptjs');

vi.mock("sequelize", () => ({
  DataTypes: {},
  literal: vi.fn(),
}));

vi.mock("../../config/database", () => ({
  default: {},
}));


describe("UserController", () => {
  var userCreatedId: number;

  const req = {
    body: {
      username: "JoGoRu",
      email: "johann.ruth@gmail.com",
      password: "senha1234",
      confirmPassword: "senha1234",
      fullName: "Johann Gossen Ruth",
    }
  };

  it("should create a valid user", async () => {
    expect(req).not.toBeFalsy();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const createdUser = User.create({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      fullName: req.body.fullName,
    })
    expect(createdUser).not.toBeFalsy();
  });

  it("should find the created user", async () => {
    const user = await User.findOne({ where: { username: req.body.username } });
    expect(user).not.toBeFalsy();

    expect(user?.username).toBe(req.body.username);
    userCreatedId = user?.id || 0;
  })

  it("should update the user", async () => {
    req.body.fullName = "Johann Gossen Ruth Atualizado";

    const updatedUser = await User.update(
      { fullName: req.body.fullName },
      { where: { id: userCreatedId } }
    );
    expect(updatedUser).not.toBeFalsy();
    expect(updatedUser?.username).toBe("Johann Gossen Ruth Atualizado");
  });

  it("should delete the user", async () => {
    const deletedUser = await User.destroy({ where: { id: userCreatedId } });
    expect(deletedUser).not.toBeFalsy();

    const user = await User.findOne({ where: { username: req.body.username } });
    expect(user).toBeFalsy();
  });
});