import { useQuery } from "@tanstack/react-query";
import { searchUsers } from "@/lib/api/user";

export function useSearchUsers(
  query?: string,
  role?: string,
  limit = 20,
  skip = 0
) {
  return useQuery({
    queryKey: ["search-users", query, role, limit, skip],
    queryFn: () => searchUsers(query as string, role, limit, skip),
    enabled: Boolean(query && query.trim().length > 0),
  });
}
