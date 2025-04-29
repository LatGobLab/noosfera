import supabase from "@/src/lib/supabase"; 
import { ReportMap } from "@/src/types/reporteMap";

export const getReportLocations = async (): Promise<ReportMap[]> => {
  const { data, error } = await supabase
    .from("reporte")
    .select("*")
    .not("latitud", "is", null)
    .not("longitud", "is", null);

  if (error) {
    console.error("Error fetching report locations:", error);
    throw new Error(error.message);
  }

  // Ensure latitud and longitud are numbers, filter out any unexpected nulls again just in case
  return (data || []).filter(
    (report: any): report is ReportMap =>
      typeof report.latitud === "number" && typeof report.longitud === "number"
  );
}; 