export function createTestUser() {
  const timestamp = Date.now();

  return {
    name: `Usuário Teste ${timestamp}`,
    email: `usuario${timestamp}@shortz.com`,
    password: '123456',
  };
}

export function createTestVideo() {
  const timestamp = Date.now();

  return {
    title: `Vídeo Teste ${timestamp}`,
    description: 'Descrição criada durante teste E2E.',
    url: `https://shortz.test/video-${timestamp}`,
  };
}