import axios from "axios";

const API = axios.create({
  baseURL: "https://silver-train-94w5xr6gwx6cp9w6-8000.app.github.dev/"
});

export const getPosts = () => API.get("/posts");
export const createPost = (data) => API.post("/posts", data);