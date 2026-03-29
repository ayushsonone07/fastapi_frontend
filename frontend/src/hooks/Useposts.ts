import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import postService from "../api/Postservice";
import socialService from "../api/Socialservice";

export interface Post {
  id: number | string
  content: string
  likes_count?: number
  liked?: boolean
  user?: { username: string }
}

interface FeedResponse {
  posts: Post[]
  page: number
  has_more: boolean
}

export const postKeys = {
  all: ["posts"] as const,
  feed: (page: number) => ["posts", "feed", page] as const,
  detail: (id: number | string) => ["posts", id] as const,
  userPosts: (userId: number | string) => ["posts", "user", userId] as const,
}

export function useFeed() {
  return useInfiniteQuery<FeedResponse>({
    queryKey: postKeys.all,
    queryFn: ({ pageParam }) =>
      postService.getFeed({ page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.has_more ? lastPage.page + 1 : undefined,
    staleTime: 1000 * 30,
  });
}

export function usePost(postId: number | string) {
  return useQuery<Post>({
    queryKey: postKeys.detail(postId),
    queryFn: () => postService.getPost(postId),
    enabled: !!postId,
  })
}

export function useUserPosts(userId: number | string) {
  return useQuery<Post[]>({
    queryKey: postKeys.userPosts(userId),
    queryFn: () => postService.getUserPosts(userId),
    enabled: !!userId,
  })
}

export function useCreatePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: postService.createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.all })
    },
  })
}

export function useDeletePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: postService.deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.all })
    },
  })
}

export function useLikePost(postId: number | string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ liked }: { liked: boolean }) =>
      liked
        ? socialService.unlikePost(postId)
        : socialService.likePost(postId),

    onMutate: async ({ liked }: { liked: boolean }) => {
      await queryClient.cancelQueries({ queryKey: postKeys.detail(postId) })

      const previous = queryClient.getQueryData<Post>(postKeys.detail(postId))

      queryClient.setQueryData<Post>(postKeys.detail(postId), (old) => {
        if (!old) return old
        return {
          ...old,
          liked: !liked,
          likes_count: liked
            ? (old.likes_count ?? 0) - 1
            : (old.likes_count ?? 0) + 1,
        }
      })

      return { previous }
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(postKeys.detail(postId), context.previous)
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.detail(postId) })
    },
  })
}