import { usePosts, useCreatePost } from "../hooks/usePosts"
import { useState } from "react"
import PostCard from "../components/PostCard"

export default function Feed() {
  const { data, isLoading } = usePosts()
  const createPost = useCreatePost()

  const [content, setContent] = useState("")

  const submit = () => {
    createPost.mutate(content)
    setContent("")
  }

  if (isLoading) return <div>Loading...</div>

  return (
    <div style={{ padding: 20 }}>
      <h2>Feed</h2>

      <div>
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's happening?"
        />
        <button onClick={submit}>Post</button>
      </div>

      {data?.map((post: any) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}