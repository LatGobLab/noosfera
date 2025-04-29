export type ReportMap = {
    id_reporte: number;
    fk_reporte_users: string; // UUID
    fk_resuelto_por: string | null; // UUID
    fecha_creacion: string; // Timestamp
    fecha_resuelto: string | null; // Timestamp
    foto_reporte: Record<string, any> | null; // jsonb
    foto_resuelto: Record<string, any> | null; // jsonb
    descripcion: string;
    num_eventos: number;
    fk_reporte_tipo: number | null;
    latitud: number ;
    longitud: number;
    estatus: boolean;
    zona: string | null;
    codigo_postal: number | null;
    asentamiento: string | null;
    nombre_municipio: string | null;
    nombre_estado: string | null;
    pais: string;
    costo: number | null;
    likes_count: number;
    comments_count: number;
    location?: unknown; // Geometry type from database
  };
  