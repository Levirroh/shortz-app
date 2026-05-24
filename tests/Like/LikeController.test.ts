import { describe, it, expect, vi, beforeEach } from "vitest";
require("../../configuration/associations");
import * as likeController from "../../modules/like/likeController";

describe("LikeController", () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = {
      body: {
        videoId: 1
      },
      params: {
        videoId: 1
      },
      session: {
        user: { id: 1 }
      },
      flash: vi.fn()
    };

    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      redirect: vi.fn().mockReturnThis()
    };
  });

  it("should be able to like a video", async () => {
    await likeController.toggleLike(req, res);

    expect(res.status).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
  });

  it("should be able to unlike a video", async () => {
    await likeController.toggleLike(req, res);

    expect(res.status).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
  });

  it("should return the like status", async () => {
    await likeController.checkLikeStatus(req, res);

    expect(res.status).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
  });
});