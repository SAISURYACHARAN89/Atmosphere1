import { fetchNotifications } from "@/lib/api/notification";
import { useQuery } from "@tanstack/react-query";

export function useGetNotifications(limit = 50, skip = 0) {
  return useQuery({
    queryKey: ["notifications", limit, skip],
    queryFn: () => fetchNotifications(limit, skip),
  });
}
