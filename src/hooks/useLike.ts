import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toggleLike, checkLikeStatus } from '../services/likeService';
import { useUserProfile } from './useUserProfile';
import { useToast } from "@/src/contexts/ToastContext";
import { useLocationStore } from '@/src/stores/useLocationStore';


export const useLike = (reporteId: number) => {
  const { profile } = useUserProfile();
  const queryClient = useQueryClient();
  const userId = profile?.id;
  const { showToast } = useToast();
  const { latitude, longitude } = useLocationStore();

  const { data: isLiked = false, isLoading: isLikeStatusLoading } = useQuery({
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
    onMutate: async (variables) => {
      if (!userId) return;

      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ['like', userId, reporteId] });
      await queryClient.cancelQueries({ queryKey: ['nearbyPosts', latitude, longitude] });

      // Snapshot the previous value
      const previousIsLiked = queryClient.getQueryData<boolean>(['like', userId, reporteId]);
      const previousReports = queryClient.getQueryData(['nearbyPosts', latitude, longitude]);

      // Optimistically update to the new value
      const newOptimisticIsLiked = !previousIsLiked;
      queryClient.setQueryData(['like', userId, reporteId], newOptimisticIsLiked);

      // Return a context object with the snapshotted value
      return { previousIsLiked, previousReports };
    },
    onError: (err, variables, context) => {
      if (!userId || !context) return;
      // Rollback on error
      queryClient.setQueryData(['like', userId, reporteId], context.previousIsLiked);
      if (context.previousReports) {
        queryClient.setQueryData(['nearbyPosts', latitude, longitude], context.previousReports);
      }
      
      showToast("Error al dar like", "error");
    },
    onSuccess: (data) => {
      if (!userId) return;

      // Ensure the 'like' status is up-to-date with server response
      queryClient.setQueryData(['like', userId, reporteId], data.isLiked);

      // Instead of updating optimistic count, just invalidate queries to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['nearbyPosts', latitude, longitude] });
    },
    onSettled: () => {
      if (!userId) return;
      // Always refetch after error or success to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['like', userId, reporteId] });
    },
  });

  return {
    isLiked,
    isLoading: isLikeStatusLoading || !userId, 
    isPending,
    toggleLike: toggleLikeMutation,
  };
}; 