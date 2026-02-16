import { saveStartupProfile } from "@/lib/api/startup";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export function useSaveStartupProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveStartupProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hottest-startups"] });
    },
  });
}
