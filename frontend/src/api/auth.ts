import client from "./client"

export const login = async (email: string, password: string) => {
  const res = await client.post("/auth/login", null, {
    params: { email, password },
  })

  return res.data
}

export const register = async (data: {
  username: string
  email: string
  password: string
}) => {
  const res = await client.post("/auth/register", data)
  return res.data
}

export const forgotPassword = async (email: string) => {
  const res = await client.post("/auth/forgot-password", { email })
  return res.data
}