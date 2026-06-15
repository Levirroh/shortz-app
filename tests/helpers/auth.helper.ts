import request from 'supertest';
import type { Express } from 'express';

type UserData = {
  name: string;
  email: string;
  password: string;
};

export async function registerUser(app: Express, user: UserData) {
  const response = await request(app)
    .post('/users')
    .send(user);

  return response;
}

export async function loginUser(app: Express, user: Pick<UserData, 'email' | 'password'>) {
  const response = await request(app)
    .post('/login')
    .send({
      email: user.email,
      password: user.password,
    });

  return response;
}

export async function registerAndLogin(app: Express, user: UserData) {
  const registerResponse = await registerUser(app, user);
  const loginResponse = await loginUser(app, user);

  return {
    registerResponse,
    loginResponse,
    userId: loginResponse.body.user?.id,
    token: loginResponse.body.token,
  };
}