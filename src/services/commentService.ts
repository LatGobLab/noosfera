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

/**
 * Agrega un nuevo comentario a una publicación.
 * @param payload Los datos del comentario a agregar.
 * @param supabase La instancia del cliente de Supabase (opcional, usa una por defecto).
 * @returns El comentario recién creado, incluyendo la información del perfil del autor.
 */

export interface AddCommentPayload {
  reportId: number | string; // Corresponde a fk_comentario_reporte
  userId: string;             // Corresponde a fk_comentario_users (uuid)
  content: string;
  parentId?: number | string | null; // Opcional, para respuestas (fk_parent_comentario)
}
export const addComment = async (
  payload: AddCommentPayload,
  supabase = supabaseClient,
): Promise<Comment> => {
  const { reportId, userId, content, parentId = null } = payload;


  const { data, error } = await supabase
    .from('comentarios')
    .insert({
      fk_comentario_reporte: reportId,
      fk_comentario_users: userId,
      contenido: content.trim(),
      fk_parent_comentario: parentId,
    })
    .select(
      `
      id_comentario,
      contenido,
      fecha_creacion,
      likes_count,
      fk_comentario_reporte,
      fk_parent_comentario
    `
    ) // Selecciona el comentario completo
    .single(); // Esperamos que la inserción devuelva un solo registro

  if (error) {
    console.error('Error al agregar comentario en Supabase:', error);
    throw error; // Propaga el error para que React Query lo maneje
  }

  if (!data) {
    // Esto no debería suceder si la inserción fue exitosa y .single() se usó correctamente
    throw new Error('No se recibieron datos después de agregar el comentario.');
  }

  return data as unknown as Comment; 
};