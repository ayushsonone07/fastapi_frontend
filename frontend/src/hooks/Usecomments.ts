// src/hooks/useComments.js
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import socialService from "../api/socialService";

export const commentKeys = {
  all: (postId) => ["comments", postId],
};

// ─── Get comments for a post ──────────────────────────────────────────────────
export function useComments(postId) {
  return useQuery({
    queryKey: commentKeys.all(postId),
    queryFn: () => socialService.getComments(postId),
    enabled: !!postId,
    staleTime: 1000 * 15,
  });
}

// ─── Add comment with optimistic update ──────────────────────────────────────
export function useAddComment(postId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content) => socialService.addComment(postId, content),

    onMutate: async (content) => {
      await queryClient.cancelQueries({ queryKey: commentKeys.all(postId) });
      const previous = queryClient.getQueryData(commentKeys.all(postId));

      // Insert optimistic comment instantly
      const optimistic = {
        id: `temp-${Date.now()}`,
        content,
        user: { username: "You" }, // replaced when server responds
        created_at: new Date().toISOString(),
        _optimistic: true,
      };

      queryClient.setQueryData(commentKeys.all(postId), (old) => ({
        ...old,
        comments: [...(old?.comments ?? []), optimistic],
      }));

      return { previous };
    },

    onError: (_err, _vars, context) => {
      queryClient.setQueryData(commentKeys.all(postId), context.previous);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.all(postId) });
    },
  });
}

// ─── Delete comment ───────────────────────────────────────────────────────────
export function useDeleteComment(postId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId) => socialService.deleteComment(postId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.all(postId) });
    },
  });
}