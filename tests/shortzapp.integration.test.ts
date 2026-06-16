import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import type { Express } from 'express';

import { createApp } from './src/app';
import { createDatabase, type ShortzDatabase } from './src/database';

import { createTestUser, createTestVideo } from './data/test-data';

import {
  registerUser,
  loginUser,
  registerAndLogin,
} from './helpers/auth.helper';

import {
  createVideo,
  listVideos,
  getVideoById,
} from './helpers/video.helper';

import {
  likeVideo,
  countVideoLikes,
} from './helpers/reaction.helper';

describe('Shortz-App - Testes de Integração com Vitest + Supertest', () => {
  let db: ShortzDatabase;
  let app: Express;

  beforeAll(async () => {
    db = await createDatabase();
    app = createApp(db);
  });

  afterAll(() => {
    db.close();
  });

  it('CT-INT-001 - Deve cadastrar e fazer login de usuário', async () => {
    const user = createTestUser();

    const registerResponse = await registerUser(app, user);

    expect(registerResponse.status).toBe(201);
    expect(registerResponse.body.user).toBeDefined();
    expect(registerResponse.body.user.id).toBeDefined();
    expect(registerResponse.body.user.email).toBe(user.email);
    expect(registerResponse.body.user.password).toBeUndefined();

    const loginResponse = await loginUser(app, {
      email: user.email,
      password: user.password,
    });

    
    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body.user).toBeDefined();
    expect(loginResponse.body.user.email).toBe(user.email);
    expect(loginResponse.body.token).toBeDefined();
  });

  it('CT-INT-002 - Deve permitir que usuário autenticado faça um post/vídeo', async () => {
    const user = createTestUser();
    const videoData = createTestVideo();

    const auth = await registerAndLogin(app, user);

    expect(auth.registerResponse.status).toBe(201);
    expect(auth.loginResponse.status).toBe(200);
    expect(auth.userId).toBeDefined();

    const createVideoResponse = await createVideo(app, {
      ...videoData,
      user_id: auth.userId,
    });

    expect(createVideoResponse.status).toBe(201);
    expect(createVideoResponse.body.video).toBeDefined();
    expect(createVideoResponse.body.video.id).toBeDefined();
    expect(createVideoResponse.body.video.title).toBe(videoData.title);
    expect(createVideoResponse.body.video.user_id).toBe(auth.userId);

    const listResponse = await listVideos(app);

    expect(listResponse.status).toBe(200);
    expect(listResponse.body.videos).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: videoData.title,
          user_id: auth.userId,
        }),
      ])
    );
  });

  it('CT-INT-003 - Deve reagir o máximo possível em um vídeo', async () => {
    const user = createTestUser();
    const videoData = createTestVideo();

    const auth = await registerAndLogin(app, user);

    const createVideoResponse = await createVideo(app, {
      ...videoData,
      user_id: auth.userId,
    });

    const videoId = createVideoResponse.body.video.id;

    const likeResponse = await likeVideo(app, videoId, auth.userId);

    expect(likeResponse.status).toBe(201);
    expect(likeResponse.body.message).toBe('Vídeo curtido com sucesso.');

    const duplicatedLikeResponse = await likeVideo(app, videoId, auth.userId);

    expect(duplicatedLikeResponse.status).toBe(409);
    expect(duplicatedLikeResponse.body.error).toBe('Usuário já curtiu este vídeo.');

    const likesResponse = await countVideoLikes(app, videoId);

    expect(likesResponse.status).toBe(200);
    expect(likesResponse.body.total).toBe(1);
  });

  it('CT-INT-004 - Deve executar rotina completa: login, assistir vídeo e curtir', async () => {
    const user = createTestUser();
    const videoData = createTestVideo();

    const auth = await registerAndLogin(app, user);

    const createVideoResponse = await createVideo(app, {
      ...videoData,
      user_id: auth.userId,
    });

    const videoId = createVideoResponse.body.video.id;

    const getVideoResponse = await getVideoById(app, videoId);

    expect(getVideoResponse.status).toBe(200);
    expect(getVideoResponse.body.video).toBeDefined();
    expect(getVideoResponse.body.video.id).toBe(videoId);
    expect(getVideoResponse.body.video.title).toBe(videoData.title);

    const likeResponse = await likeVideo(app, videoId, auth.userId);

    expect(likeResponse.status).toBe(201);

    const likesResponse = await countVideoLikes(app, videoId);

    expect(likesResponse.status).toBe(200);
    expect(likesResponse.body.total).toBe(1);
  });
});
