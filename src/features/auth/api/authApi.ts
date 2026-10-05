import { apiFetch } from "@/helpers/apiHelper";
import type { LoginValues, RegisterValues } from "@/types/action";

const authApi = {
  postLogin({ email, password }: LoginValues) {
    return apiFetch<{ token: string }>("/auth/login", {
      method: "POST",
      auth: false,
      body: { email, password },
    });
  },

  postRegister({ name, email, password }: RegisterValues) {
    return apiFetch("/auth/register", {
      method: "POST",
      auth: false,
      body: { name, email, password },
    });
  },
};

export default authApi;
