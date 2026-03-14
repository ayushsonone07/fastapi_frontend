import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get("https://silver-train-94w5xr6gwx6cp9w6-8000.app.github.dev/posts");
      console.log(res.data);   // check in browser console
      setPosts(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Feed</h1>
      {posts.map((post) => (
        <div key={post.id}>
          <div>
              <p>{post.user_id}</p>
              <p>{post.content}</p>
          </div>
        </div>
      ))}

    </div>
  );
}