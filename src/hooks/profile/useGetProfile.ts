import { useQuery } from "@tanstack/react-query";
import { fetchAndStoreUser } from "@/lib/api/user";

export function useGetProfile() {
  return useQuery({
    queryKey: ["getProfile"],
    queryFn: fetchAndStoreUser,
  });
}
