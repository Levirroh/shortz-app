import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';

process.env.NODE_ENV = 'test';

const app = require('../app');
const sequelize = require('../configuration/database');
const User = require('../modules/users/userModel');

function createTestUser() {
  const timestamp = Date.now();

  return {
    username: `usuario_teste_${timestamp}`,
    fullName: `Usuário Teste ${timestamp}`,
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

  it('CT-INT-002 - Deve cadastrar usuário pela rota oficial POST /register', async () => {
    const agent = request.agent(app);
    const user = createTestUser();

    const response = await agent
      .post('/register')
      .type('form')
      .send({
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        password: user.password,
        confirmPassword: user.password,
      })
      .timeout({ response: 10000, deadline: 20000 });

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('/login');

    const userInDatabase = await User.findOne({
      where: { email: user.email },
    });

    expect(userInDatabase).not.toBeNull();
    expect(userInDatabase.email).toBe(user.email);
    expect(userInDatabase.username).toBe(user.username);
  }, 30000);

  it('CT-INT-003 - Deve fazer login e acessar o feed autenticado', async () => {
    const agent = request.agent(app);
    const user = createTestUser();

    const registerResponse = await agent
      .post('/register')
      .type('form')
      .send({
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        password: user.password,
        confirmPassword: user.password,
      })
      .timeout({ response: 10000, deadline: 20000 });

    expect(registerResponse.status).toBe(302);
    expect(registerResponse.headers.location).toBe('/login');

    const loginResponse = await agent
      .post('/login')
      .type('form')
      .send({
        login: user.email,
        password: user.password,
      })
      .timeout({ response: 10000, deadline: 20000 });

    expect(loginResponse.status).toBe(302);
    expect(loginResponse.headers.location).toBe('/feed');

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

    expect(response.status).toBe(302);
    expect(response.headers.location).toContain('/login');
  }, 30000);
});