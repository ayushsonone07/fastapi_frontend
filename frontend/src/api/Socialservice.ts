// src/api/socialService.js
import apiClient from "./Apiclient";

const socialService = {
  // ── Likes ──────────────────────────────────────────────────────────────────

  // POST /posts/:postId/like
  async likePost(postId : number | string) {
    const { data } = await apiClient.post(`/posts/${postId}/like`);
    return data; // { liked: true, likes_count: 42 }
  },

  // DELETE /posts/:postId/like
  async unlikePost(postId : number | string) {
    const { data } = await apiClient.delete(`/posts/${postId}/like`);
    return data; // { liked: false, likes_count: 41 }
  },

  // ── Comments ───────────────────────────────────────────────────────────────

  // GET /posts/:postId/comments
  async getComments(postId: number | string) {
    const { data } = await apiClient.get(`/posts/${postId}/comments`);
    return data; // { comments: [] }
  },

  // POST /posts/:postId/comments
  async addComment(postId: number | string, content: string) {
    const { data } = await apiClient.post(`/posts/${postId}/comments`, {
      content,
    });
    return data; // new comment object
  },

  // DELETE /posts/:postId/comments/:commentId
  async deleteComment(postId: number | string, commentId: number | string) {
    await apiClient.delete(`/posts/${postId}/comments/${commentId}`);
  },
};

export default socialService;