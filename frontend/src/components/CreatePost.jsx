import { useState } from "react";
import axios from "axios";

export default function CreatePost() {

  const [content, setContent] = useState("");
  const [userId, setUserId] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://silver-train-94w5xr6gwx6cp9w6-8000.app.github.dev/posts",
        {
          content: content,
          user_id: Number(userId)
        }
      );

      console.log(response.data);
      alert("Post created successfully");

      setContent("");
      setUserId("");

    } catch (error) {
      console.error(error);
      alert("Error creating post");
    }
  };

  return (
    <div style={{padding:"20px"}}>

      <h2>Create Post</h2>

      <form onSubmit={handleSubmit}>

        <div>
          <label>Content</label>
          <br />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your post..."
            required
          />
        </div>

        <br />

        <div>
          <label>User ID</label>
          <br />
          <input
            type="number"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter user id"
            required
          />
        </div>

        <br />

        <button type="submit">
          Create Post
        </button>

      </form>

    </div>
  );
}