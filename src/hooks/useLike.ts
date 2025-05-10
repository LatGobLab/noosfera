import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toggleLike, checkLikeStatus } from '../services/likeService';
import { useUserProfile } from './useUserProfile';
import { useState, useEffect } from 'react';

// Assuming a Report type might look like this, adjust if you have a defined type
// For example, import { Report } from '@/src/types';
type ReportInCache = {
  id: number;
  likes_count: number;
  // ... other report properties
};

// Define return type for toggleLike service
type LikeStatus = {
  isLiked: boolean;
  likesCount: number;
};

export const useLike = (reporteId: number, initialLikesCount: number) => {
  const { profile } = useUserProfile();
  const queryClient = useQueryClient();
  const userId = profile?.id;
  
  // Local state for optimistic likes count
  const [optimisticLikesCount, setOptimisticLikesCount] = useState(initialLikesCount);

  // Query to check if the post is liked by the current user
  const { data: isLiked = false, isLoading: isLikeStatusLoading } = useQuery({
    queryKey: ['like', userId, reporteId],
    queryFn: () => {
      if (!userId) return false;
      return checkLikeStatus(userId, reporteId);
    },
    enabled: !!userId,
  });

  // Update optimistic count when initial count changes from props
  useEffect(() => {
    setOptimisticLikesCount(initialLikesCount);
  }, [initialLikesCount]);

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
      await queryClient.cancelQueries({ queryKey: ['reports'] }); // Assuming 'reports' is your general query key for posts

      // Snapshot the previous value
      const previousIsLiked = queryClient.getQueryData<boolean>(['like', userId, reporteId]);
      const previousReports = queryClient.getQueryData<ReportInCache[]>(['reports']);

      // Optimistically update to the new value
      const newOptimisticIsLiked = !previousIsLiked;
      queryClient.setQueryData(['like', userId, reporteId], newOptimisticIsLiked);

      // Update local optimistic likes count
      setOptimisticLikesCount(prevCount => 
        prevCount + (newOptimisticIsLiked ? 1 : -1)
      );

      // Optimistically update the likes_count in the 'reports' cache
      queryClient.setQueryData<ReportInCache[] | undefined>(['reports'], (oldReports) =>
        oldReports?.map(report =>
          report.id === reporteId
            ? {
                ...report,
                likes_count: report.likes_count + (newOptimisticIsLiked ? 1 : -1),
              }
            : report
        )
      );

      // Return a context object with the snapshotted value
      return { previousIsLiked, previousReports };
    },
    onError: (err, variables, context) => {
      if (!userId || !context) return;
      // Rollback on error
      queryClient.setQueryData(['like', userId, reporteId], context.previousIsLiked);
      if (context.previousReports) {
        queryClient.setQueryData(['reports'], context.previousReports);
      }
      
      // Rollback the optimistic likes count
      setOptimisticLikesCount(initialLikesCount);
      
      // console.error("Failed to toggle like:", err);
      // Here you could also add a toast notification to inform the user
    },
    onSuccess: (data) => {
      // `data` is { isLiked: boolean, likesCount: number } from the server
      if (!userId) return;

      // Ensure the 'like' status is up-to-date with server response
      queryClient.setQueryData(['like', userId, reporteId], data.isLiked);

      // Update the local optimistic count with the server value
      setOptimisticLikesCount(data.likesCount);

      // Ensure the likes_count in 'reports' cache is up-to-date with server response
      queryClient.setQueryData<ReportInCache[] | undefined>(['reports'], (oldReports) =>
        oldReports?.map(report =>
          report.id === reporteId
            ? { ...report, likes_count: data.likesCount }
            : report
        )
      );
    },
    onSettled: () => {
      if (!userId) return;
      // Always refetch after error or success to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['like', userId, reporteId] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });

  return {
    isLiked,
    isLoading: isLikeStatusLoading || !userId, // isLoading for the initial check
    isPending,
    toggleLike: toggleLikeMutation,
    optimisticLikesCount,
  };
}; 