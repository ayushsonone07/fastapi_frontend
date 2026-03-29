// src/api/userService.js
import apiClient from "./Apiclient";

const userService = {
  // GET /users/:userId
  async getProfile(userId) {
    const { data } = await apiClient.get(`/users/${userId}`);
    return data;
  },

  // PUT /users/me  — update bio, username, avatar
  async updateProfile(updates) {
    if (updates.avatar) {
      const form = new FormData();
      Object.entries(updates).forEach(([k, v]) => form.append(k, v));
      const { data } = await apiClient.put("/users/me", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    }
    const { data } = await apiClient.put("/users/me", updates);
    return data;
  },

  // POST /users/:userId/follow
  async followUser(userId) {
    const { data } = await apiClient.post(`/users/${userId}/follow`);
    return data;
  },

  // DELETE /users/:userId/follow
  async unfollowUser(userId) {
    const { data } = await apiClient.delete(`/users/${userId}/follow`);
    return data;
  },
};

export default userService;