
import { likeStartup, unlikeStartup } from "@/lib/api/startup";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useLikeStartup(startupId: string) {
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: () => likeStartup(startupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["startups"] });
    },
  });

  const unlikeMutation = useMutation({
    mutationFn: () => unlikeStartup(startupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["startups"] });
    },
  });

  const toggleLike = async (isLiked: boolean) => {
    if (isLiked) {
      return unlikeMutation.mutateAsync();
    } else {
      return likeMutation.mutateAsync();
    }
  };

  return {
    toggleLike,
    isLoading: likeMutation.isPending || unlikeMutation.isPending,
  };
}
