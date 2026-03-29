// src/hooks/useProfile.js
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import userService from "../api/userService";

export const profileKeys = {
  detail: (id) => ["profile", id],
};

// ─── Get any user's profile ───────────────────────────────────────────────────
export function useProfile(userId) {
  return useQuery({
    queryKey: profileKeys.detail(userId),
    queryFn: () => userService.getProfile(userId),
    enabled: !!userId,
    staleTime: 1000 * 60, // profiles are relatively stable
  });
}

// ─── Update current user's profile ───────────────────────────────────────────
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userService.updateProfile,
    onSuccess: (updated) => {
      queryClient.setQueryData(profileKeys.detail(updated.id), updated);
    },
  });
}

// ─── Follow / Unfollow with optimistic update ─────────────────────────────────
export function useFollowUser(userId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ isFollowing }) =>
      isFollowing
        ? userService.unfollowUser(userId)
        : userService.followUser(userId),

    onMutate: async ({ isFollowing }) => {
      await queryClient.cancelQueries({
        queryKey: profileKeys.detail(userId),
      });
      const previous = queryClient.getQueryData(profileKeys.detail(userId));

      queryClient.setQueryData(profileKeys.detail(userId), (old) => ({
        ...old,
        is_following: !isFollowing,
        followers_count: isFollowing
          ? old.followers_count - 1
          : old.followers_count + 1,
      }));

      return { previous };
    },

    onError: (_err, _vars, context) => {
      queryClient.setQueryData(profileKeys.detail(userId), context.previous);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.detail(userId) });
    },
  });
}