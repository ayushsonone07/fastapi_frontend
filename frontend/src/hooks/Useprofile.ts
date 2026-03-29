import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import userService from "../api/Userservice";

export const profileKeys = {
  detail: (id: string | number) => ["profile", id] as const,
};

interface Profile {
  id: string | number;
  is_following: boolean;
  followers_count: number;
}

export function useProfile(userId: string | number) {
  return useQuery({
    queryKey: profileKeys.detail(userId),
    queryFn: () => userService.getProfile(userId),
    enabled: !!userId,
    staleTime: 1000 * 60,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userService.updateProfile,
    onSuccess: (updated: Profile) => {
      queryClient.setQueryData(profileKeys.detail(updated.id), updated);
    },
  });
}

export function useFollowUser(userId: string | number) {
  const queryClient = useQueryClient();

  return useMutation<any, unknown, { isFollowing: boolean }, { previous: Profile | undefined }>({
    mutationFn: ({ isFollowing }: { isFollowing: boolean }) =>
      isFollowing
        ? userService.unfollowUser(userId)
        : userService.followUser(userId),

    onMutate: async ({ isFollowing }: { isFollowing: boolean }) => {
      await queryClient.cancelQueries({ queryKey: profileKeys.detail(userId) });
      const previous = queryClient.getQueryData<Profile>(profileKeys.detail(userId));

      queryClient.setQueryData(profileKeys.detail(userId), (old: Profile | undefined) => {
        if (!old) return old;
        return {
          ...old,
          is_following: !isFollowing,
          followers_count: isFollowing
            ? old.followers_count - 1
            : old.followers_count + 1,
        };
      });

      return { previous };
    },

    onError: (_err: unknown, _vars: { isFollowing: boolean }, context: { previous: Profile | undefined } | undefined) => {
      if (context?.previous) {
        queryClient.setQueryData(profileKeys.detail(userId), context.previous); // ✅ Fix 2: correct query key
      }
    }, // ✅ Fix 1: added missing comma

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.detail(userId) });
    },
  });
}