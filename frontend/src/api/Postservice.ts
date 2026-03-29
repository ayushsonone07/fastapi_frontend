// src/api/postService.js
import apiClient from "./Apiclient";

const postService = {
  // GET /posts?page=1&limit=10
  async getFeed({ page = 1, limit = 10 } = {}) {
    const { data } = await apiClient.get("/posts", {
      params: { page, limit },
    });
    return data; // { posts: [], total, page, has_more }
  },

  // GET /posts/:id
  async getPost(postId) {
    const { data } = await apiClient.get(`/posts/${postId}`);
    return data;
  },

  // POST /posts  — supports image upload via FormData
  async createPost({ content, image }) {
    if (image) {
      const form = new FormData();
      form.append("content", content);
      form.append("image", image);
      const { data } = await apiClient.post("/posts", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    }
    const { data } = await apiClient.post("/posts", { content });
    return data;
  },

  // DELETE /posts/:id
  async deletePost(postId) {
    await apiClient.delete(`/posts/${postId}`);
  },

  // GET /users/:userId/posts
  async getUserPosts(userId) {
    const { data } = await apiClient.get(`/users/${userId}/posts`);
    return data;
  },
};

export default postService;