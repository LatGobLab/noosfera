import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addComment, type AddCommentPayload } from '@/src/services/commentService';
import supabaseClient from '@/src/lib/supabase';

export const useAddComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddCommentPayload) => 
      addComment(payload, supabaseClient),
    
    // Invalidate and refetch queries when a comment is added
    onSuccess: (newComment, variables) => {
      // Invalidate the specific query for this report's comments
      queryClient.invalidateQueries({ 
        queryKey: ['comments', variables.reportId, 'infinite'],
        // Only invalidate the list queries, not individual comment queries if any
        predicate: (query) => 
          Array.isArray(query.queryKey) && 
          query.queryKey.length > 2 && 
          query.queryKey[0] === 'comments' && 
          query.queryKey[1] === variables.reportId
      });
    },
  });
};
