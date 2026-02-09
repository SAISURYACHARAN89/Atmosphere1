import { updateSettings } from "@/lib/api/settings";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });
}
