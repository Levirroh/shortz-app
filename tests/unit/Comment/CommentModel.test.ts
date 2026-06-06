import { describe, it, expect, beforeEach } from "vitest";
import sequelize from "../../../configuration/database";
import Comment from "../../../modules/comment/commentModel";

describe("CommentModel", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  it("should create a new comment", async () => {
    const comment = await Comment.create({
      content: "adorei o vídeo",
      userId: 1,
      videoId: 1
    });

    expect(comment).not.toBeFalsy();
    expect(comment.content).toBe("adorei o vídeo");
    expect(comment.userId).toBe(1);
    expect(comment.videoId).toBe(1);
  });

  it("should be able to update a comment", async () => {
    const comment = await Comment.create({
      content: "adorei o vídeo",
      userId: 1,
      videoId: 1
    });

    await comment.update({
      content: "comentário editado"
    });

    expect(comment.content).toBe("comentário editado");
  });

  it("should be able to delete a comment", async () => {
    const comment = await Comment.create({
      content: "adorei o vídeo",
      userId: 1,
      videoId: 1
    });

    await comment.destroy();

    const deletedComment = await Comment.findByPk(comment.id);

    expect(deletedComment).toBeNull();
  });
});