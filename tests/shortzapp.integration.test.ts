import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';

process.env.NODE_ENV = 'test';

const app = require('../app');
const sequelize = require('../configuration/database');

function createTestUser() {
  const timestamp = Date.now();

  return {
    username: `usuario_teste_${timestamp}`,
    name: `Usuário Teste ${timestamp}`,
    email: `usuario${timestamp}@shortz.com`,
    password: '123456',
  };
}

describe('Shortz-App - Testes de Integração com Vitest + Supertest', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  }, 30000);

  afterAll(async () => {
    await sequelize.close();
  });

  it('CT-INT-001 - Deve abrir a tela oficial de cadastro', async () => {
    const response = await request(app)
      .get('/register')
      .timeout({ response: 10000, deadline: 20000 });

    expect(response.status).toBe(200);
    expect(response.text).toContain('Criar Conta');
  }, 30000);

  it('CT-INT-002 - Deve cadastrar usuário', async () => {
    const agent = request.agent(app);
    const user = createTestUser();

    const response = await agent
      .post('/register')
      .type('form')
      .send({
        username: user.username,
        name: user.name,
        email: user.email,
        password: user.password,
        confirmPassword: user.password,
      })
      .timeout({ response: 10000, deadline: 20000 });

    expect([200, 201, 302]).toContain(response.status);
  }, 30000);

  it('CT-INT-003 - Deve fazer login e acessar o feed autenticado', async () => {
    const agent = request.agent(app);
    const user = createTestUser();

    const registerResponse = await agent
      .post('/register')
      .type('form')
      .send({
        username: user.username,
        name: user.name,
        email: user.email,
        password: user.password,
        confirmPassword: user.password,
      })
      .timeout({ response: 10000, deadline: 20000 });

    expect([200, 201, 302]).toContain(registerResponse.status);

    const loginResponse = await agent
      .post('/login')
      .type('form')
      .send({
        login: user.email,
        password: user.password,
      })
      .timeout({ response: 10000, deadline: 20000 });

    expect([200, 302]).toContain(loginResponse.status);

    const feedResponse = await agent
      .get('/feed')
      .timeout({ response: 10000, deadline: 20000 });

    expect(feedResponse.status).toBe(200);
    expect(feedResponse.text).toContain('Feed');
  }, 30000);

  it('CT-INT-004 - Deve bloquear curtida sem usuário autenticado', async () => {
    const response = await request(app)
      .post('/video/999999/toggle-like')
      .timeout({ response: 10000, deadline: 20000 });

    expect([302, 401, 403]).toContain(response.status);

    if (response.status === 302) {
      expect(response.headers.location).toContain('/login');
    }
  }, 30000);
});