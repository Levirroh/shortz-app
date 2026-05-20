import { describe, it, expect, vi, beforeEach } from "vitest";
import * as likeController from "../../modules/like/likeController";

vi.mock("sequelize", () => ({
  DataTypes: {},
  literal: vi.fn(), 
}));

vi.mock("../../config/database", () => ({
  default: {},
}));


describe("LikeController", () => {
  var req: any;

  beforeEach(() => {
    req = {
      body: {
        videoId: 1
      },
      session: {
        user: { id: 1 }
      },
      flash: vi.fn() 
    };
  });

  it("should be able to like a video", async () => {
    const like = await likeController.toggleLike(req);
    expect(like).not.toBeFalsy();
    expect(like?.videoId).toBe(1);
    expect(like?.userId).toBe(1);
  });

  it("should be able to unlike a video", async () => {
    const like = await likeController.toggleLike(req);
    expect(like).toBeNull();
  });

  it("should return the like if the video has already been liked", async () => {
    const like = await likeController.checkLikeStatus(req);
    expect(like).not.toBeFalsy();
  });

});