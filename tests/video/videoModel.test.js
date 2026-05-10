import { describe, expect, it, vi } from "vitest";
import Video from "../../modules/video/videoModel";

vi.mock("sequelize", () => ({
  DataTypes: {}
}));

vi.mock("../../configuration/database.js", () => ({}));

describe("Video Model", () => {
  it("should create a valid video", () => {
    const video = new Video({
      title: "My Video",
      description: "This a test video in shortz-app",
      duration: 30
    })

    expect(video.title).toBe("My video")
  });
});