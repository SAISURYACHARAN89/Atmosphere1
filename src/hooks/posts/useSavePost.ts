import { savePost, unsavePost } from "@/lib/api/posts";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useSavePost(postId: string, savedId?: string) {
  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: () => savePost({ postId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["savedPosts"] });
    },
  });

  const unsaveMutation = useMutation({
    mutationFn: () => {
      if (!savedId) throw new Error("Missing savedId");
      return unsavePost(savedId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["savedPosts"] });
    },
  });

  const toggleSave = async (isSaved: boolean) => {
    if (isSaved) {
      return unsaveMutation.mutateAsync();
    } else {
      return saveMutation.mutateAsync();
    }
  };

  return {
    toggleSave,
    isLoading: saveMutation.isPending || unsaveMutation.isPending,
  };
}
