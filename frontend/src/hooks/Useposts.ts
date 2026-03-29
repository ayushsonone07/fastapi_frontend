// src/hooks/usePosts.js
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import postService from "../api/Postservice";
import socialService from "../api/Socialservice";

// ─── Query Keys (centralised so invalidation is consistent) ──────────────────
export const postKeys = {
  all: ["posts"],
  feed: (page) => ["posts", "feed", page],
  detail: (id) => ["posts", id],
  userPosts: (userId) => ["posts", "user", userId],
};

// ─── Feed with infinite scroll ───────────────────────────────────────────────
export function useFeed() {
  return useInfiniteQuery({
    queryKey: postKeys.all,
    queryFn: ({ pageParam }) => postService.getFeed({ page: pageParam as number }),
    initialPageParam: 1,                        // ← this was missing, required in v5
    getNextPageParam: (lastPage: any) =>
      lastPage.has_more ? lastPage.page + 1 : undefined,
    staleTime: 1000 * 30,
  });
}

// ─── Single post ─────────────────────────────────────────────────────────────
export function usePost(postId) {
  return useQuery({
    queryKey: postKeys.detail(postId),
    queryFn: () => postService.getPost(postId),
    enabled: !!postId,
  });
}

// ─── User's posts ─────────────────────────────────────────────────────────────
export function useUserPosts(userId) {
  return useQuery({
    queryKey: postKeys.userPosts(userId),
    queryFn: () => postService.getUserPosts(userId),
    enabled: !!userId,
  });
}

// ─── Create post ─────────────────────────────────────────────────────────────
export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postService.createPost,
    onSuccess: () => {
      // Invalidate feed so new post appears immediately
      queryClient.invalidateQueries({ queryKey: postKeys.all });
    },
  });
}

// ─── Delete post ─────────────────────────────────────────────────────────────
export function useDeletePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postService.deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.all });
    },
  });
}

// ─── Like / Unlike with optimistic update ────────────────────────────────────
export function useLikePost(postId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ liked }) =>
      liked ? socialService.unlikePost(postId) : socialService.likePost(postId),

    // Immediately flip the UI before the request completes
    onMutate: async ({ liked }) => {
      await queryClient.cancelQueries({ queryKey: postKeys.detail(postId) });
      const previous = queryClient.getQueryData(postKeys.detail(postId));

      queryClient.setQueryData(postKeys.detail(postId), (old) => ({
        ...old,
        liked: !liked,
        likes_count: liked ? old.likes_count - 1 : old.likes_count + 1,
      }));

      return { previous };
    },

    // Roll back on error
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(postKeys.detail(postId), context.previous);
    },

    // Always sync with server truth
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.detail(postId) });
    },
  });
}