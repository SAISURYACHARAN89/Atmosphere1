import { addStartupComment } from "@/lib/api/startup";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useStartupComment(startupId: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: { text: string; parent?: string }) =>
      addStartupComment(startupId, payload?.text, payload?.parent),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["startupComments", startupId],
      });
      queryClient.invalidateQueries({ queryKey: ["startup-posts"] });
    },
  });

  const submitComment = async (payload: { text: string; parent?: string }) => {
    return mutation.mutateAsync(payload);
  };

  return {
    submitComment,
    isPending: mutation.isPending,
  };
}
