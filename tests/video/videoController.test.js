import { describe, it, expect, vitest } from "vitest";

import Video from "../../modules/video/videoModel";

describe("Add Video", () => {
  const video = new Video({
    title: "My Video",
    description: "This a test video in shortz-app",
  })

  it("should create a valid video", () => {
    expect(video.title).toBe("My Video");
    expect(video.description).toBe("This a test video in shortz-app");
  }); 
});