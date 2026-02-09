import { changePassword } from "@/lib/api/settings";
import { useMutation } from "@tanstack/react-query";

interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export function useChangePassword() {
  return useMutation({
    mutationFn: ({ currentPassword, newPassword }: ChangePasswordPayload) =>
      changePassword(currentPassword, newPassword),
  });
}
