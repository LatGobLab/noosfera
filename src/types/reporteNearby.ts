export interface ReporteNearby {
  id_reporte: number;
  fk_reporte_users: string;
  fk_resuelto_por: string | null; 
  fecha_creacion: string; 
  foto_reporte: any | null; 
  foto_resuelto: any | null; 
  descripcion: string;
  num_eventos: number;
  fk_reporte_tipo: number | null; 
  latitud: number | null;
  longitud: number | null;
  estatus: boolean;
  likes_count: number;
  comments_count: number;
  profile_username: string | null; 
  profile_avatar_url: string | null; 
  profile_rol_nombre: string | null;
  tipo_nombre: string | null;
  distance_meters: number;
}

