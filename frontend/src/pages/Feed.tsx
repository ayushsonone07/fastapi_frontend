import { useRef, useCallback } from "react";
import { useFeed, useCreatePost } from "../hooks/Useposts";
import { useAuth } from "../context/AuthContext";

export default function FeedPage() {
  const { user } = useAuth();
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFeed();

  const createPost = useCreatePost();
  const contentRef = useRef();

  // Infinite scroll: observe the last item
  const observer = useRef();
  const lastPostRef = useCallback(
    (node) => {
      if (isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) fetchNextPage();
      });
      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  async function handleSubmit(e) {
    e.preventDefault();
    const content = contentRef.current.value.trim();
    if (!content) return;
    await createPost.mutateAsync({ content });
    contentRef.current.value = "";
  }

  if (isLoading) return <p>Loading feed…</p>;
  if (isError)   return <p>Failed to load feed. Please refresh.</p>;

  // Flatten pages into a single post array
  const posts = data.pages.flatMap((page) => page.posts);

  return (
    <div>
      {/* Create post form — style with your existing CSS */}
      <form onSubmit={handleSubmit}>
        <textarea ref={contentRef} placeholder="What's on your mind?" />
        <button type="submit" disabled={createPost.isPending}>
          {createPost.isPending ? "Posting…" : "Post"}
        </button>
      </form>

      {/* Feed */}
      {posts.map((post, i) => {
        const isLast = i === posts.length - 1;
        return (
          <div key={post.id} ref={isLast ? lastPostRef : null}>
            {/* Drop in your existing PostCard component here */}
            <p><strong>{post.user.username}</strong>: {post.content}</p>
          </div>
        );
      })}

      {isFetchingNextPage && <p>Loading more…</p>}
      {!hasNextPage && posts.length > 0 && <p>You're all caught up!</p>}
    </div>
  );
}