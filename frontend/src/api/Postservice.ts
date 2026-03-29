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
  async getPost(postId: number | string) {
    const { data } = await apiClient.get(`/posts/${postId}`);
    return data;
  },

  // POST /posts  — supports image upload via FormData
  async createPost({ content, image }: { content: string, image?: File }) {
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
  async deletePost(postId: number | string) {
    await apiClient.delete(`/posts/${postId}`);
  },

  // GET /users/:userId/posts
  async getUserPosts(userId: number | string) {
    const { data } = await apiClient.get(`/users/${userId}/posts`);
    return data;
  },
};

export default postService;