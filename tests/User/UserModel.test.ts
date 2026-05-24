import { describe, it, expect } from "vitest";
import User from "../../modules/users/userModel";
const bcrypt = require("bcryptjs");

describe("UserModel", () => {

  var createdUser: any;

  const userData = {
    username: "JoGoRu",
    email: "johann.ruth@gmail.com",
    password: "senha1234",
    fullName: "Johann Gossen Ruth",
  };

  it("should create a valid user", async () => {

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const [user, created] = await User.findOrCreate({
      where: {
        username: userData.username
      },
      defaults: {
        email: userData.email,
        password: hashedPassword,
        fullName: userData.fullName,
      }
    });

    createdUser = user.dataValues;

    expect(createdUser).not.toBeFalsy();
    expect(createdUser.username).toBe(userData.username);
  });

  it("should find the created user", async () => {

    const user = await User.findByPk(createdUser.id);

    expect(user).not.toBeFalsy();
    expect(user?.username).toBe(userData.username);
  });

  it("should update the user", async () => {

    await User.update(
      {
        fullName: "Johann Gossen Ruth Atualizado"
      },
      {
        where: { id: createdUser.id }
      }
    );

    const updatedUser = await User.findByPk(createdUser.id);

    expect(updatedUser).not.toBeFalsy();
    expect(updatedUser?.fullName)
      .toBe("Johann Gossen Ruth Atualizado");
  });

  it("should delete the user", async () => {

    const deletedCount = await User.destroy({
      where: { id: createdUser.id }
    });

    expect(deletedCount).toBe(1);

    const deletedUser = await User.findByPk(createdUser.id);

    expect(deletedUser).toBeNull();
  });

});