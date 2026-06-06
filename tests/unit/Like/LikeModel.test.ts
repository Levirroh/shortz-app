import { describe, it, expect, beforeEach } from "vitest";
import Like from "../../modules/like/likeModel";
import sequelize from "../../configuration/database";

describe("LikeModel", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });
  
    it("should be able to delete a like", async () => {
      const deletedCount = await Like.destroy({
        where: {
          userId: 1,
          videoId: 1,
        },
      });
  
      expect(deletedCount).toBe(1);
    });

  it("should be able to create a like", async () => {
    const like = await Like.create({
      userId: 1,
      videoId: 1,
    });

    expect(like).not.toBeFalsy();
    expect(like?.userId).toBe(1);
    expect(like?.videoId).toBe(1);
  });

});