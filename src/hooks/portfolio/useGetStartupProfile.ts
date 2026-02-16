import { getStartupProfile } from "@/lib/api/user";
import { useQuery } from "@tanstack/react-query";

export function useGetStartupProfile(userId?: string) {
  return useQuery({
    queryKey: ["startup-profile", userId],
    queryFn: () => getStartupProfile(userId),
    enabled: !!userId,
  });
}
