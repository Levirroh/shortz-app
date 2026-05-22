import { describe, it, expect, vi, beforeEach } from "vitest";
import * as commentController from "../../modules/comment/commentController";

vi.mock("sequelize", () => ({
  DataTypes: {},
  literal: vi.fn(),
}));

vi.mock("../../config/database", () => ({
  default: {},
}));


describe("CommentController", () => {
  var req: any;

  beforeEach(() => {
    req = {
      body: {
        title: "adorei o vídeo",
        userId: 1,
        videoId: 1,
      },
      session: {
        user: { id: 1 }
      },
      params: {
        videoId: 1
      },
      flash: vi.fn()
    };
  });

  it("should be able to create comment", async () => {
    const comment = await commentController.addComment(req);
    expect(comment).not.toBeFalsy();
  });

  it("should be able to get all comments for a video", async () => {
    const comments = await commentController.getComments(req);
    expect(comments).not.toBeFalsy();
    expect(Array.isArray(comments)).toBe(true);
  });
});