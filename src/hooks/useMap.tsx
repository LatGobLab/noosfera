import { useQuery } from "@tanstack/react-query";
import { getReportLocations } from "@/src/services/reportService";
import { ReportMap } from "@/src/types/reporteMap";

// Define query key
const reportsLocationQueryKey = ["reports", "locations"];

export const useGetReportsLocation = () => {
  return useQuery<ReportMap[], Error>({
    queryKey: reportsLocationQueryKey,
    queryFn: getReportLocations,
    // Optional: Add staleTime or cacheTime if needed
    // staleTime: 5 * 60 * 1000, // 5 minutes
    // cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};
