import { SupabaseClient } from '@supabase/supabase-js';

export interface Profile {
  id: string; 
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
}

export interface Comment {
  id_comentario: number; 
  contenido: string; 
  fecha_creacion: string; // timestamp without time zone (viene como string ISO)
  likes_count: number; // integer
  fk_comentario_users: string; // uuid (ID del autor)
  fk_comentario_reporte: number; // bigint (ID de la publicación/reporte)
  fk_parent_comentario: number | null; // bigint (ID del comentario padre, si es una respuesta)
  profiles: Profile | null; // El objeto del perfil del usuario que hizo el comentario.
}

// Parámetros para la función de obtención de comentarios paginados
export interface FetchPaginatedCommentsParams {
  supabase: SupabaseClient;
  reportId: number | string;
  pageParam?: number; // React Query lo envía como undefined para la primera página, nosotros lo manejamos con default.
  pageSize?: number;
}

// Respuesta de la función de obtención de comentarios paginados
export interface PaginatedCommentsResponse {
  comments: Comment[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
}

// Parámetros para la función de obtención de respuestas a un comentario
export interface FetchRepliesParams {
    supabase: SupabaseClient;
    parentCommentId: number | string;
}