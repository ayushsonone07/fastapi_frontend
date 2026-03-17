import client from "./client"

export const getPosts = async () => {
  const res = await client.get("/posts")
  return res.data
}

export const createPost = async (content: string) => {
  const res = await client.post("/posts", { content })
  return res.data
}