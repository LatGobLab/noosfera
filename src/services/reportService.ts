import supabase from "@/src/lib/supabase";
import { Session } from "@supabase/supabase-js";
import queryClient from "./queryClient";

export type ReportData = {
  description: string;
  photoUri: string;
  latitude: number;
  longitude: number;
};



// Upload image to Supabase Storage
export const uploadReportImage = async (
  uri: string,
  session: Session | null
): Promise<string | null> => {
  if (!session?.user) {
    throw new Error("No hay sesión activa");
  }

  // Convert local URI to ArrayBuffer
  const arrayBuffer = await fetch(uri).then((res) => res.arrayBuffer());

  // Generate a random name for the image
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString();
  const filename = `${timestamp}-${randomSuffix}.jpeg`;

  // Upload to Supabase Storage
  const { data, error: uploadError } = await supabase.storage
    .from("reporte")
    .upload(filename, arrayBuffer, {
      contentType: `image/jpeg`,
      upsert: true,
    });

  if (uploadError) {
    throw uploadError;
  }

  return filename;
};

// Create report entry in the database
export const createReport = async (
  imagePath: string,
  description: string,
  latitude: number,
  longitude: number,
  userId: string
) => {
  // Create the array directly in raw format
  const fotoReporteArray = [imagePath];

  // Insert into reporte table
  const { data, error } = await supabase.from("reporte").insert({
    fk_reporte_users: userId,
    descripcion: description,
    latitud: latitude,
    longitud: longitude,
    fk_reporte_tipo: 1, // Fixed value as requested
    foto_reporte: fotoReporteArray,
  });

  if (error) {
    throw error;
  }

  return data;
};

// Submit a complete report
export const submitReport = async (reportData: ReportData, session: Session | null) => {
  if (!session?.user) {
    throw new Error("No hay sesión activa");
  }

  // Upload the image to Supabase Storage
  const imagePath = await uploadReportImage(reportData.photoUri, session);

  if (!imagePath) {
    throw new Error("No se pudo subir la imagen");
  }

  // Create the record in the reporte table
  await createReport(
    imagePath,
    reportData.description,
    reportData.latitude,
    reportData.longitude,
    session.user.id
  );

  // Invalidate queries to reload data
  queryClient.invalidateQueries({ queryKey: ["reports", "locations"] });
  queryClient.invalidateQueries({ queryKey: ["nearbyPosts"] });
}; 