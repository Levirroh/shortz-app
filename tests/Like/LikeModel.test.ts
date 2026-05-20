import { describe, it, expect, vi, beforeEach } from "vitest";
import Like from "../../modules/like/likeModel";


vi.mock("sequelize", () => ({
  DataTypes: {},
  literal: vi.fn(), 
}));

vi.mock("../../config/database", () => ({
  default: {},
}));


describe("LikeModel", () => {
  var req: any;

  beforeEach(() => {
    req = {
      body: {
        title: "primeiro vídeo",
      },
      flash: vi.fn() 
    };
  });

  it("should be able to create a like", async () => {
    const like = await Like.create({
      userId: 1,
      videoId: 1,
    });
    expect(like).not.toBeFalsy();
  });

  it("should be able to delete a like", async () => {
    const like = await Like.delete({
      userId: 1,
      videoId: 1,
    });
    expect(like).not.toBeFalsy();
  });
});