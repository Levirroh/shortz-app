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

  it('CT-E2E-001 - Deve cadastrar e fazer login de usuário', async () => {
    // Given
    const user = createTestUser();

    // When
    const registerResponse = await registerUser(app, user);

    // Then
    expect(registerResponse.status).toBe(201);
    expect(registerResponse.body.user).toBeDefined();
    expect(registerResponse.body.user.id).toBeDefined();
    expect(registerResponse.body.user.email).toBe(user.email);
    expect(registerResponse.body.user.password).toBeUndefined();

    // When
    const loginResponse = await loginUser(app, {
      email: user.email,
      password: user.password,
    });

    // Then
    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body.user).toBeDefined();
    expect(loginResponse.body.user.email).toBe(user.email);
    expect(loginResponse.body.token).toBeDefined();
  });

  it('CT-E2E-002 - Deve permitir que usuário autenticado faça um post/vídeo', async () => {
    // Given
    const user = createTestUser();
    const videoData = createTestVideo();

    const auth = await registerAndLogin(app, user);

    expect(auth.registerResponse.status).toBe(201);
    expect(auth.loginResponse.status).toBe(200);
    expect(auth.userId).toBeDefined();

    // When
    const createVideoResponse = await createVideo(app, {
      ...videoData,
      user_id: auth.userId,
    });

    // Then
    expect(createVideoResponse.status).toBe(201);
    expect(createVideoResponse.body.video).toBeDefined();
    expect(createVideoResponse.body.video.id).toBeDefined();
    expect(createVideoResponse.body.video.title).toBe(videoData.title);
    expect(createVideoResponse.body.video.user_id).toBe(auth.userId);

    // Then extra: confirma que aparece na listagem
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

  it('CT-E2E-003 - Deve reagir o máximo possível em um vídeo', async () => {
    // Given
    const user = createTestUser();
    const videoData = createTestVideo();

    const auth = await registerAndLogin(app, user);

    const createVideoResponse = await createVideo(app, {
      ...videoData,
      user_id: auth.userId,
    });

    const videoId = createVideoResponse.body.video.id;

    // When: reação válida
    const likeResponse = await likeVideo(app, videoId, auth.userId);

    // Then
    expect(likeResponse.status).toBe(201);
    expect(likeResponse.body.message).toBe('Vídeo curtido com sucesso.');

    // When: tenta repetir a mesma reação
    const duplicatedLikeResponse = await likeVideo(app, videoId, auth.userId);

    // Then: regra de negócio impede duplicidade
    expect(duplicatedLikeResponse.status).toBe(409);
    expect(duplicatedLikeResponse.body.error).toBe('Usuário já curtiu este vídeo.');

    // Then extra: contador deve continuar em 1
    const likesResponse = await countVideoLikes(app, videoId);

    expect(likesResponse.status).toBe(200);
    expect(likesResponse.body.total).toBe(1);
  });

  it('CT-E2E-004 - Deve executar rotina completa: login, assistir vídeo e curtir', async () => {
    // Given
    const user = createTestUser();
    const videoData = createTestVideo();

    const auth = await registerAndLogin(app, user);

    const createVideoResponse = await createVideo(app, {
      ...videoData,
      user_id: auth.userId,
    });

    const videoId = createVideoResponse.body.video.id;

    // When: usuário busca/assiste o vídeo
    const getVideoResponse = await getVideoById(app, videoId);

    // Then
    expect(getVideoResponse.status).toBe(200);
    expect(getVideoResponse.body.video).toBeDefined();
    expect(getVideoResponse.body.video.id).toBe(videoId);
    expect(getVideoResponse.body.video.title).toBe(videoData.title);

    // When: usuário curte o vídeo
    const likeResponse = await likeVideo(app, videoId, auth.userId);

    // Then
    expect(likeResponse.status).toBe(201);

    // Then extra: confirma persistência da curtida
    const likesResponse = await countVideoLikes(app, videoId);

    expect(likesResponse.status).toBe(200);
    expect(likesResponse.body.total).toBe(1);
  });
});
