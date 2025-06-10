import { useQuery } from "@tanstack/react-query";
import supabase from "../lib/supabase";
import { ReporteDetails } from "../types/reporteDetails";

// Get report details by ID using RPC function
const getMapDetailsById = async (reportId: number): Promise<ReporteDetails> => {
    const { data, error } = await supabase.rpc('get_reporte_details_by_id', {
      report_id_param: reportId
    });
    if (error) {
      throw error;
    }
    if (!data || data.length === 0) {
      throw new Error('Reporte no encontrado');
    }
    return data[0];
  };

export const useMapDetails = (reportId: number) => {
  // React Query hook for getting report details
    return useQuery({
      queryKey: ['reporteDetails', reportId],
      queryFn: () => getMapDetailsById(reportId),
      enabled: !!reportId, // Only run if reportId is provided
      staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
      gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    });
}; 