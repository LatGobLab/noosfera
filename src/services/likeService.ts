import supabase from '@/src/lib/supabase';

export type LikeStatus = {
  isLiked: boolean;
  likesCount: number;
};

/**
 * Toggle a like for a report
 */
export const toggleLike = async (
  userId: string,
  reporteId: number
): Promise<LikeStatus> => {
  // Check if like exists
  const { data: existingLike } = await supabase
    .from('likes')
    .select('*')
    .eq('fk_like_users', userId)
    .eq('fk_like_reporte', reporteId)
    .single();

  if (existingLike) {
    // Unlike: Delete the like if it exists
    await supabase
      .from('likes')
      .delete()
      .eq('fk_like_users', userId)
      .eq('fk_like_reporte', reporteId);
    
    // Get updated like count
    const { data: countData } = await supabase
      .from('reportes')
      .select('likes_count')
      .eq('id', reporteId)
      .single();
    
    return { 
      isLiked: false, 
      likesCount: countData?.likes_count || 0 
    };
  } else {
    // Like: Insert a new like
    await supabase
      .from('likes')
      .insert([
        { 
          fk_like_users: userId, 
          fk_like_reporte: reporteId 
        }
      ]);
    
    // Get updated like count
    const { data: countData } = await supabase
      .from('reportes')
      .select('likes_count')
      .eq('id', reporteId)
      .single();
    
    return { 
      isLiked: true, 
      likesCount: countData?.likes_count || 0 
    };
  }
};

/**
 * Check if a user has liked a report
 */
export const checkLikeStatus = async (
  userId: string,
  reporteId: number
): Promise<boolean> => {
  const { data } = await supabase
    .from('likes')
    .select('*')
    .eq('fk_like_users', userId)
    .eq('fk_like_reporte', reporteId)
    .single();
  
  return !!data;
}; 