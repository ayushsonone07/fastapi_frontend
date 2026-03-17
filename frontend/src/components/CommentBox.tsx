import { useState } from "react"

export default function CommentBox() {
  const [comment, setComment] = useState("")

  const submit = () => {
    console.log(comment)
    setComment("")
  }

  return (
    <div>
      <input
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write comment"
      />

      <button onClick={submit}>Comment</button>
    </div>
  )
}