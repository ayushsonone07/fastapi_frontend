type Props = {
  post: {
    id: number
    content: string
  }
}

export default function PostCard({ post }: Props) {
  return (
    <div style={{ border: "1px solid #ddd", padding: 10, marginBottom: 10 }}>
      <p>{post.content}</p>
    </div>
  )
}