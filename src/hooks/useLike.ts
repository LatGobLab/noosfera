import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toggleLike, checkLikeStatus } from '../services/likeService';
import { useUserProfile } from './useUserProfile';
import { useState, useEffect } from 'react';
import { useToast } from "@/src/contexts/ToastContext";
import { useLocationStore } from '@/src/stores/useLocationStore';

type ReportInCache = {
  id_reporte: number;
  likes_count: number;
};

export const useLike = (reporteId: number, initialLikesCount: number) => {
  const { profile } = useUserProfile();
  const queryClient = useQueryClient();
  const userId = profile?.id;
  const { showToast } = useToast();
  const { latitude, longitude } = useLocationStore();

  const [optimisticLikesCount, setOptimisticLikesCount] = useState(initialLikesCount);
  console.log("optimisticLikesCount", optimisticLikesCount, initialLikesCount);

  const { data: isLiked = false, isLoading: isLikeStatusLoading } = useQuery({
    queryKey: ['like', userId, reporteId],
    queryFn: () => {
      if (!userId) return false;
      return checkLikeStatus(userId, reporteId);
    },
    enabled: !!userId,
  });

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
      await queryClient.cancelQueries({ queryKey: ['nearbyPosts', latitude, longitude] });

      // Snapshot the previous value
      const previousIsLiked = queryClient.getQueryData<boolean>(['like', userId, reporteId]);
      const previousReports = queryClient.getQueryData(['nearbyPosts', latitude, longitude]);

      // Optimistically update to the new value
      const newOptimisticIsLiked = !previousIsLiked;
      queryClient.setQueryData(['like', userId, reporteId], newOptimisticIsLiked);

      // Update local optimistic likes count
      setOptimisticLikesCount(prevCount => 
        prevCount + (newOptimisticIsLiked ? 1 : -1)
      );

      // Optimistically update the likes_count in the 'nearbyPosts' cache
      queryClient.setQueryData(['nearbyPosts', latitude, longitude], (oldData: any) => {
        if (!oldData) return oldData;
        
        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            data: page.data.map((report: ReportInCache) =>
              report.id_reporte === reporteId
                ? {
                    ...report,
                    likes_count: report.likes_count + (newOptimisticIsLiked ? 1 : -1),
                  }
                : report
            )
          }))
        };
      });

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
      
      // Rollback the optimistic likes count
      setOptimisticLikesCount(initialLikesCount);
      showToast("Error al dar like", "error");
    },
    onSuccess: (data) => {
      // `data` is { isLiked: boolean, likesCount: number } from the server
      if (!userId) return;

      // Ensure the 'like' status is up-to-date with server response
      queryClient.setQueryData(['like', userId, reporteId], data.isLiked);

      // Update the local optimistic count with the server value
      setOptimisticLikesCount(data.likesCount);

      // Ensure the likes_count in 'nearbyPosts' cache is up-to-date with server response
      queryClient.setQueryData(['nearbyPosts', latitude, longitude], (oldData: any) => {
        if (!oldData) return oldData;
        
        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            data: page.data.map((report: ReportInCache) =>
              report.id_reporte === reporteId
                ? { ...report, likes_count: data.likesCount }
                : report
            )
          }))
        };
      });
    },
    onSettled: () => {
      if (!userId) return;
      // Always refetch after error or success to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['like', userId, reporteId] });
      // No invalidamos nearbyPosts para evitar refetch innecesario
      // La actualización optimista debería ser suficiente
    },
  });

  return {
    isLiked,
    isLoading: isLikeStatusLoading || !userId, 
    isPending,
    toggleLike: toggleLikeMutation,
    optimisticLikesCount,
  };
}; 