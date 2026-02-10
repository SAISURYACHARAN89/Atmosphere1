import { followUser, unfollowUser } from "@/lib/api/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useFollowUser(userId: string) {
  const queryClient = useQueryClient();

  const followMutation = useMutation({
    mutationFn: () => followUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: () => unfollowUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const toggleFollow = async (isFollowing: boolean) => {
    if (isFollowing) {
      return unfollowMutation.mutateAsync();
    } else {
      return followMutation.mutateAsync();
    }
  };

  return {
    toggleFollow,
    isLoading:
      followMutation.isPending || unfollowMutation.isPending,
  };
}
