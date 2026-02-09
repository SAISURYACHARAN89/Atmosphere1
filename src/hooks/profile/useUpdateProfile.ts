import { useMutation } from "@tanstack/react-query";
import { updateProfile } from "@/lib/api/user";
import { ZGetProfileResponse } from "@/types/Profile";

export function useUpdateProfile() {
  return useMutation<ZGetProfileResponse, Error, unknown>({
    mutationFn: (payload: unknown) =>
      updateProfile(payload),
  });
}
