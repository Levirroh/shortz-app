import express from 'express';
import type { ShortzDatabase } from './database';

export function createApp(db: ShortzDatabase) {
  const app = express();

  app.use(express.json());

  app.post('/users', (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: 'Nome, e-mail e senha são obrigatórios.',
      });
    }

    try {
      db.run(
        `
          INSERT INTO users (name, email, password)
          VALUES (?, ?, ?)
        `,
        [name, email, password]
      );

      const user = db.get(
        `
          SELECT id, name, email
          FROM users
          WHERE email = ?
        `,
        [email]
      );

      return res.status(201).json({ user });
    } catch (err: any) {
      if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return res.status(409).json({
          error: 'Este e-mail já está cadastrado.',
        });
      }

      return res.status(500).json({
        error: 'Erro interno ao cadastrar usuário.',
      });
    }
  });

  app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const user = db.get<any>(
      `
        SELECT id, name, email
        FROM users
        WHERE email = ? AND password = ?
      `,
      [email, password]
    );

    if (!user) {
      return res.status(401).json({
        error: 'E-mail ou senha inválidos.',
      });
    }

    return res.status(200).json({
      message: 'Login realizado com sucesso.',
      user,
      token: `fake-token-user-${user.id}`,
    });
  });

  app.post('/videos', (req, res) => {
    const { title, description, url, user_id } = req.body;

    if (!title || !url || !user_id) {
      return res.status(400).json({
        error: 'Título, URL e usuário são obrigatórios.',
      });
    }

    const user = db.get(
      `
        SELECT id
        FROM users
        WHERE id = ?
      `,
      [user_id]
    );

    if (!user) {
      return res.status(404).json({
        error: 'Usuário não encontrado.',
      });
    }

    db.run(
      `
        INSERT INTO videos (title, description, url, user_id)
        VALUES (?, ?, ?, ?)
      `,
      [title, description ?? null, url, user_id]
    );

    const video = db.get(
      `
        SELECT id, title, description, url, user_id
        FROM videos
        WHERE title = ? AND user_id = ?
        ORDER BY id DESC
        LIMIT 1
      `,
      [title, user_id]
    );

    return res.status(201).json({ video });
  });

  app.get('/videos', (_req, res) => {
    const videos = db.all(`
      SELECT id, title, description, url, user_id
      FROM videos
      ORDER BY id DESC
    `);

    return res.status(200).json({ videos });
  });

  app.get('/videos/:id', (req, res) => {
    const videoId = Number(req.params.id);

    const video = db.get(
      `
        SELECT id, title, description, url, user_id
        FROM videos
        WHERE id = ?
      `,
      [videoId]
    );

    if (!video) {
      return res.status(404).json({
        error: 'Vídeo não encontrado.',
      });
    }

    return res.status(200).json({ video });
  });

  app.post('/videos/:id/like', (req, res) => {
    const videoId = Number(req.params.id);
    const { user_id } = req.body;

    const video = db.get(
      `
        SELECT id
        FROM videos
        WHERE id = ?
      `,
      [videoId]
    );

    if (!video) {
      return res.status(404).json({
        error: 'Vídeo não encontrado.',
      });
    }

    try {
      db.run(
        `
          INSERT INTO likes (user_id, video_id)
          VALUES (?, ?)
        `,
        [user_id, videoId]
      );

      return res.status(201).json({
        message: 'Vídeo curtido com sucesso.',
      });
    } catch (err: any) {
      if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return res.status(409).json({
          error: 'Usuário já curtiu este vídeo.',
        });
      }

      return res.status(500).json({
        error: 'Erro interno ao curtir vídeo.',
      });
    }
  });

  app.get('/videos/:id/likes', (req, res) => {
    const videoId = Number(req.params.id);

    const result = db.get<any>(
      `
        SELECT COUNT(*) as total
        FROM likes
        WHERE video_id = ?
      `,
      [videoId]
    );

    return res.status(200).json({
      total: result?.total ?? 0,
    });
  });

  return app;
}