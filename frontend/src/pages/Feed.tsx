import { useRef, useCallback } from "react";
import { useFeed, useCreatePost } from "../hooks/Useposts";

interface Post {
  id: string | number;
  content: string;
  user: { username: string };
}

export default function Feed() {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFeed();

  const createPost = useCreatePost();
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastPostRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) fetchNextPage();
      });
      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const content = contentRef.current?.value.trim();
    if (!content) return;
    await createPost.mutateAsync({ content, image: undefined });
    if (contentRef.current) contentRef.current.value = "";
  }

  if (isLoading) return <p>Loading feed…</p>;
  if (isError) return <p>Failed to load feed. Please refresh.</p>;

  const posts: Post[] = data?.pages.flatMap((page: any) => page.posts) ?? [];

  return (
    <div style={{ padding: "40px", maxWidth: "600px", margin: "0 auto" }}>
      <form onSubmit={handleSubmit} style={{ marginBottom: "24px" }}>
        <textarea
          ref={contentRef}
          placeholder="What's on your mind?"
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ddd",
            fontSize: "15px",
            resize: "vertical",
            boxSizing: "border-box",
          }}
          rows={3}
        />
        <button
          type="submit"
          disabled={createPost.isPending}
          style={{
            marginTop: "8px",
            padding: "10px 24px",
            background: "#4f46e5",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          {createPost.isPending ? "Posting…" : "Post"}
        </button>
      </form>

      {posts.map((post, i) => {
        const isLast = i === posts.length - 1;
        return (
          <div
            key={post.id}
            ref={isLast ? lastPostRef : null}
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
              marginBottom: "16px",
            }}
          >
            <strong>{post.user.username}</strong>
            <p style={{ margin: "8px 0 0" }}>{post.content}</p>
          </div>
        );
      })}

      {isFetchingNextPage && <p>Loading more…</p>}
      {!hasNextPage && posts.length > 0 && (
        <p style={{ textAlign: "center", color: "#888" }}>You're all caught up!</p>
      )}
    </div>
  );
}