import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/helpers/apiHelper", () => ({
  apiFetch: vi.fn().mockResolvedValue({ success: true }),
}));

import { apiFetch } from "@/helpers/apiHelper";
import authApi from "./authApi";

describe("authApi", () => {
  beforeEach(() => vi.mocked(apiFetch).mockClear());

  it("postLogin", async () => {
    await authApi.postLogin({ email: "a@b.c", password: "123456" });
    expect(apiFetch).toHaveBeenCalledWith("/auth/login", {
      method: "POST",
      auth: false,
      body: { email: "a@b.c", password: "123456" },
    });
  });

  it("postRegister", async () => {
    await authApi.postRegister({ name: "A", email: "a@b.c", password: "123456" });
    expect(apiFetch).toHaveBeenCalledWith("/auth/register", {
      method: "POST",
      auth: false,
      body: { name: "A", email: "a@b.c", password: "123456" },
    });
  });
});
