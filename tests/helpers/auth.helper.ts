import request from 'supertest';

type Agent = ReturnType<typeof request.agent>;

type UserData = {
  username: string;
  name: string;
  email: string;
  password: string;
};

export async function registerUser(agent: Agent, user: UserData) {
  return agent
    .post('/register')
    .type('form')
    .send({
      username: user.username,
      name: user.name,
      email: user.email,
      password: user.password,
      confirmPassword: user.password,
    });
}

export async function loginUser(agent: Agent, user: Pick<UserData, 'email' | 'password'>) {
  return agent
    .post('/login')
    .type('form')
    .send({
      email: user.email,
      password: user.password,
    });
}

export async function registerAndLogin(agent: Agent, user: UserData) {
  const registerResponse = await registerUser(agent, user);
  const loginResponse = await loginUser(agent, user);

  return {
    registerResponse,
    loginResponse,
  };
}