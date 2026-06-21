import request from 'supertest';

type Agent = ReturnType<typeof request.agent>;

type VideoUploadData = {
  title: string;
  description: string;
  videoPath: string;
  thumbnailPath: string;
};

export async function uploadVideo(agent: Agent, video: VideoUploadData) {
  return agent
    .post('/upload')
    .field('title', video.title)
    .field('description', video.description)
    .attach('video', video.videoPath)
    .attach('thumbnail', video.thumbnailPath);
}

export async function getFeed(agent: Agent) {
  return agent.get('/feed');
}

export async function getVideoPage(agent: Agent, videoId: number) {
  return agent.get(`/video/${videoId}`);
}

export function extractFirstVideoIdFromFeed(html: string): number | null {
  const match = html.match(/href=["']\/video\/(\d+)["']/);

  if (!match) {
    return null;
  }

  return Number(match[1]);
}