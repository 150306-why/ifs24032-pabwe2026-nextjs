import { apiFetch } from "@/helpers/apiHelper";
import type { User } from "@/types";
import type { ChangePasswordValues, ChangeProfileValues } from "@/types/action";

const userApi = {
  getUsers() {
    return apiFetch<{ users: User[] }>("/users");
  },

  getMe() {
    return apiFetch<{ user: User }>("/users/me");
  },

  putMe({ name, email }: ChangeProfileValues) {
    return apiFetch("/users/me", {
      method: "PUT",
      body: { name, email },
    });
  },

  postMePhoto(file: File) {
    const formData = new FormData();
    formData.append("photo", file);
    return apiFetch("/users/me/photo", { method: "POST", formData });
  },

  putMePassword({ password, newPassword }: ChangePasswordValues) {
    return apiFetch("/users/me/password", {
      method: "PUT",
      body: { password, new_password: newPassword },
    });
  },
};

export default userApi;
