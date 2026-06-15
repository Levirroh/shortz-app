import request from 'supertest';
import type { Express } from 'express';

export async function likeVideo(app: Express, videoId: number, userId: number) {
  const response = await request(app)
    .post(`/videos/${videoId}/like`)
    .send({
      user_id: userId,
    });

  return response;
}

export async function countVideoLikes(app: Express, videoId: number) {
  const response = await request(app)
    .get(`/videos/${videoId}/likes`);

  return response;
}