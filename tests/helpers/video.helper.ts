import request from 'supertest';
import type { Express } from 'express';

type VideoData = {
  title: string;
  description?: string;
  url: string;
  user_id: number;
};

export async function createVideo(app: Express, video: VideoData) {
  const response = await request(app)
    .post('/videos')
    .send(video);

  return response;
}

export async function listVideos(app: Express) {
  const response = await request(app)
    .get('/videos');

  return response;
}

export async function getVideoById(app: Express, videoId: number) {
  const response = await request(app)
    .get(`/videos/${videoId}`);

  return response;
}