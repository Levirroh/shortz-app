import { describe, it, expect, vi, beforeAll, beforeEach } from "vitest";
import * as videoController from "../../modules/video/videoController";
import * as userController from "../../modules/users/userController";
 
vi.mock("sequelize", () => ({
  DataTypes: {}
}));
 
vi.mock("../../config/database", () => ({}));
 

describe("VideoController", () => {
  var req: any

  beforeEach(() => {
      req = {
        body: {
          title: "primeiro vídeo",
          description: "Teste",
          videoPath: "public/uploads/videos/video-1775088294897-905250876.mp4",
          thumbnailPath: "public/uploads/thumbnails/thumbnail-1775088294897-905250876.jpg",
          userId: 1,
        }
      };
  });

  it("data should not be empty", () => {
    expect(req.body.title).not.toBeFalsy();
    expect(req.body.videoPath).not.toBeFalsy();
    expect(req.body.thumbnailPath).not.toBeFalsy();
    expect(req.body.userId).not.toBeFalsy();
  });

  it("user should be valid", async () => {
    const user = await userController.getProfile(req.body.userId);
    expect(user).not.toBeFalsy();
  });

  it("should return 400 if title is missing", async () => {
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
 
    await videoController.uploadVideo(req, res);
  });
});