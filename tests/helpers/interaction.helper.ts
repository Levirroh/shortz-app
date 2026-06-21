import request from 'supertest';

type Agent = ReturnType<typeof request.agent>;

export async function toggleLike(agent: Agent, videoId: number) {
  return agent.post(`/video/${videoId}/toggle-like`);
}

export async function checkLikeStatus(agent: Agent, videoId: number) {
  return agent.get(`/video/${videoId}/like-status`);
}

export async function addComment(agent: Agent, videoId: number, comment: string) {
  return agent
    .post(`/video/${videoId}/comment`)
    .send({
      content: comment,
      comment,
      text: comment,
    });
}

export async function getComments(agent: Agent, videoId: number) {
  return agent.get(`/video/${videoId}/comments`);
}