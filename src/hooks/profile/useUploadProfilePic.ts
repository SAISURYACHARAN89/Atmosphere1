import { useMutation } from "@tanstack/react-query";
import { uploadProfilePicture } from "@/lib/api/user";

export function useUploadProfilePic() {
  return useMutation({
    mutationFn: (formData: FormData) => uploadProfilePicture(formData),
  });
}
