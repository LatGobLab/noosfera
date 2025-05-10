import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toggleLike, checkLikeStatus } from '../services/likeService';
import { useUserProfile } from './useUserProfile';

export const useLike = (reporteId: number) => {
  const { profile } = useUserProfile();
  const queryClient = useQueryClient();
  const userId = profile?.id;

  // Query to check if the post is liked by the current user
  const { data: isLiked = false, isLoading } = useQuery({
    queryKey: ['like', userId, reporteId],
    queryFn: () => {
      if (!userId) return false;
      return checkLikeStatus(userId, reporteId);
    },
    enabled: !!userId,
  });

  // Mutation to toggle like status
  const { mutate: toggleLikeMutation, isPending } = useMutation({
    mutationFn: () => {
      if (!userId) throw new Error('User must be logged in to like a post');
      return toggleLike(userId, reporteId);
    },
    onSuccess: (data) => {
      // Update the like status in the cache
      queryClient.setQueryData(['like', userId, reporteId], data.isLiked);
      
      // Update the post data in the cache to reflect new like count
      queryClient.invalidateQueries({
        queryKey: ['reports'],
      });
    },
  });

  return {
    isLiked,
    isLoading: isLoading || !userId,
    isPending,
    toggleLike: toggleLikeMutation,
  };
}; 