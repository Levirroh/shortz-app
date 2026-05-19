import { describe, it, expect, vi, beforeEach } from "vitest";
import * as videoController from "../../modules/video/videoController";

vi.mock("sequelize", () => ({
  DataTypes: {},
  literal: vi.fn(), 
}));

vi.mock("../../config/database", () => ({
  default: {},
}));

describe("VideoController", () => {
  var req: any;
  var videoId: number;

  beforeEach(() => {
    req = {
      body: {
        title: "primeiro vídeo",
        description: "Teste",
        videoPath: "public/uploads/videos/video-1775088294897-905250876.mp4",
        thumbnailPath: "public/uploads/covers/thumbnail-1775088295243-295609409.jpg",
        userId: 1,
        duration: 70
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

  it("should get all videos", async () => {
    const videos = await videoController.getAllVideos();
    expect(videos).not.toBeFalsy();
  });

  it("video should be uploaded", async () => {
    const newVideo = await videoController.uploadVideo(req);
    expect(newVideo).not.toBeFalsy();
  });
});