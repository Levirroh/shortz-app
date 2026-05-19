import { describe, it, expect, vi, beforeEach } from "vitest";
import * as videoController from "../../modules/video/videoController";
import * as userController from "../../modules/users/userController";
import * as fs from 'fs';
import path from "path";
import User from "../../modules/users/userModel";

vi.mock("sequelize", () => ({
  DataTypes: {},
  literal: vi.fn(), 
}));

vi.mock("../../config/database", () => ({
  default: {},
}));

vi.mock("../../modules/users/userController", () => ({
  getProfile: vi.fn(async (id) => {
    if (id === 1) return { id: 1, username: "testuser" };
    return null;
  })
}));

describe("VideoController", () => {
  var req: any;

  beforeEach(() => {
    req = {
      body: {
        title: "primeiro vídeo",
        description: "Teste",
        videoPath: "public/uploads/videos/video-1775088294897-905250876.mp4",
        thumbnailPath: "public/uploads/covers/thumbnail-1775088295243-295609409.jpg",
        userId: 1,
      },
      session: {
        user: { id: 1 }
      },
      files: {
        video: [{ filename: "video-1775088294897-905250876.mp4" }],
        thumbnail: [{ filename: "thumbnail-1775088295243-295609409.jpg" }]
      },
      flash: vi.fn() 
    };
  });

  it("cover and video should be valid", () => {
    expect(req.body.videoPath).toContain(".mp4");
    expect(req.body.thumbnailPath).toContain(".jpg");

    const caminhoAbsolutoVideo = path.resolve(req.body.videoPath);
    const caminhoAbsolutoThumbnail = path.resolve(req.body.thumbnailPath);

    expect(fs.existsSync(caminhoAbsolutoVideo)).toBeTruthy();
    expect(fs.existsSync(caminhoAbsolutoThumbnail)).toBeTruthy();
  });

  it("input data should not be empty", () => {
    expect(req.body.title).not.toBeFalsy();
    expect(req.body.videoPath).not.toBeFalsy();
    expect(req.body.thumbnailPath).not.toBeFalsy();
    expect(req.body.userId).not.toBeFalsy();
  });

  it("user should be valid", async () => {
    const user = await userController.getProfile(req.body.userId);
    expect(user).not.toBeFalsy();
  });

  it("should redirect to /upload if files are missing", async () => {
    req.files = null; 

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
      redirect: vi.fn() 
    };

    await videoController.uploadVideo(req, res);

    expect(req.flash).toHaveBeenCalledWith("error", "Por favor, envie o vídeo e a capa.");
    expect(res.redirect).toHaveBeenCalledWith("/upload");
  });
});