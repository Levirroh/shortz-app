import { describe, it, expect, vi, beforeEach } from "vitest";
import Comment from "../../modules/comment/commentModel";



vi.mock("sequelize", () => ({
  DataTypes: {},
  literal: vi.fn(),
}));

vi.mock("../../config/database", () => ({
  default: {},
}));


describe("CommentModel", () => {
  var req: any;

  beforeEach(() => {
    req = {
      body: {
        title: "adorei o vídeo",
        userId: 1,
        videoId: 1,
      }
    };
  });

  it("should create a new comment", async () => {
    const comment = await Comment.create({
      title: req.body.title,
      userId: req.body.userId,
      videoId: req.body.videoId
    });
    expect(comment).not.toBeFalsy();
    expect(comment?.title).toBe("adorei o vídeo");
    expect(comment?.userId).toBe(1);
    expect(comment?.videoId).toBe(1);
  });

  it("should be able to update a comment", async () => {
    
    const comment = await Comment.update({
      title: req.body.title,
      userId: req.body.userId,
      videoId: req.body.videoId
    }, { where: { userId: req.body.userId, videoId: req.body.videoId, title: req.body.title } });

    expect(comment).not.toBeFalsy();
  });

  it("should be able to delete a comment", async () => {
    const comment = await Comment.delete({ where: { id: 1 } });
    expect(comment).not.toBeFalsy();
    const deletedComment = await Comment.findOne({ where: { userId: req.body.userId, videoId: req.body.videoId, title: req.body.title } });
    expect(deletedComment).toBeFalsy();
  });

});