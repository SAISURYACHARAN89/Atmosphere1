import { useQuery } from "@tanstack/react-query";
import { fetchExplorePosts } from "@/lib/api/posts";

export function useExplorePosts(limit = 20, skip = 0) {
  return useQuery({
    queryKey: ["explorePosts", limit, skip],
    queryFn: () => fetchExplorePosts(limit, skip),
  });
}
