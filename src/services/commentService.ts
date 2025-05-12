import type {
  Comment,
  PaginatedCommentsResponse,
  FetchPaginatedCommentsParams,
  FetchRepliesParams,
} from '@/src/types/comments'; 
import supabaseClient from '@/src/lib/supabase'; 

const DEFAULT_COMMENTS_PAGE_SIZE = 20;

/**
 * Obtiene una página de comentarios de nivel superior para una publicación (reporte) específica.
 */
export const fetchPaginatedTopLevelComments = async ({
  supabase = supabaseClient,
  reportId,
  pageParam = 1,
  pageSize = DEFAULT_COMMENTS_PAGE_SIZE,
}: FetchPaginatedCommentsParams): Promise<PaginatedCommentsResponse> => {
  if (!reportId) {
    console.error("fetchPaginatedTopLevelComments: reportId es requerido.");
    throw new Error("El ID de la publicación es requerido para obtener comentarios.");
  }

  const from = (pageParam - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from('comentarios')
    .select(
      `
      id_comentario,
      contenido,
      fecha_creacion,
      likes_count,
      fk_comentario_users,
      fk_comentario_reporte,
      fk_parent_comentario,
      profiles (
        id,
        username,
        full_name,
        avatar_url
      )
    `,
      { count: 'exact' }
    )
    .eq('fk_comentario_reporte', reportId)
    .is('fk_parent_comentario', null)
    .order('fecha_creacion', { ascending: false })
    .range(from, to);

  if (error) {
    console.error('Error al obtener comentarios paginados:', error);
    throw error;
  }

  return {
    comments: (data as unknown as Comment[]) || [], 
    totalCount: count || 0,
    currentPage: pageParam,
    pageSize,
  };
};

/**
 * Obtiene respuestas para un comentario específico.
 */
export const fetchRepliesForComment = async ({
    supabase = supabaseClient,
    parentCommentId
}: FetchRepliesParams): Promise<Comment[]> => {
  if (!parentCommentId) {
    throw new Error("El ID del comentario padre es requerido para obtener respuestas.");
  }
  const { data, error } = await supabase
    .from('comentarios')
    .select(`
      id_comentario,
      contenido,
      fecha_creacion,
      likes_count,
      fk_comentario_reporte,
      fk_parent_comentario,
      profiles (
        id,
        username,
        full_name,
        avatar_url
      )
    `)
    .eq('fk_parent_comentario', parentCommentId)
    .order('fecha_creacion', { ascending: true });

  if (error) {
    console.error('Error al obtener respuestas del comentario:', error);
    throw error;
  }
  return (data as unknown as Comment[]) || []; 
};