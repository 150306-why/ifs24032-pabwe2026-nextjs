import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/helpers/apiHelper", () => ({
  apiFetch: vi.fn().mockResolvedValue({ success: true }),
}));

import { apiFetch } from "@/helpers/apiHelper";
import userApi from "./userApi";

describe("userApi", () => {
  beforeEach(() => vi.mocked(apiFetch).mockClear());

  it("getUsers", async () => {
    await userApi.getUsers();
    expect(apiFetch).toHaveBeenCalledWith("/users");
  });

  it("getMe", async () => {
    await userApi.getMe();
    expect(apiFetch).toHaveBeenCalledWith("/users/me");
  });

  it("putMe", async () => {
    await userApi.putMe({ name: "A", email: "a@b.c" });
    expect(apiFetch).toHaveBeenCalledWith("/users/me", {
      method: "PUT",
      body: { name: "A", email: "a@b.c" },
    });
  });

  it("postMePhoto", async () => {
    const file = new File(["x"], "a.png", { type: "image/png" });
    await userApi.postMePhoto(file);
    const [path, options] = vi.mocked(apiFetch).mock.calls[0];
    expect(path).toBe("/users/me/photo");
    expect(options?.method).toBe("POST");
    expect(options?.formData?.get("photo")).toBe(file);
  });

  it("putMePassword", async () => {
    await userApi.putMePassword({ password: "lama", newPassword: "baru" });
    expect(apiFetch).toHaveBeenCalledWith("/users/me/password", {
      method: "PUT",
      body: { password: "lama", new_password: "baru" },
    });
  });
});
