import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  BASE_URL,
  apiFetch,
  getAccessToken,
  putAccessToken,
  removeAccessToken,
} from "./apiHelper";

describe("apiHelper", () => {
  beforeEach(() => {
    localStorage.clear();
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ success: true, message: "ok", data: {} }),
    }) as unknown as typeof fetch;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const lastCall = () =>
    (fetch as unknown as ReturnType<typeof vi.fn>).mock.calls[0] as [
      string,
      RequestInit & { headers: Record<string, string> },
    ];

  it("menyimpan, mengambil, dan menghapus token", () => {
    expect(getAccessToken()).toBeNull();
    putAccessToken("abc");
    expect(getAccessToken()).toBe("abc");
    removeAccessToken();
    expect(getAccessToken()).toBeNull();
  });

  it("BASE_URL default dari konfigurasi", () => {
    expect(BASE_URL).toBe("https://open-api.delcom.org/api/v1");
  });

  it("GET tanpa token dan tanpa params", async () => {
    const result = await apiFetch("/users");
    expect(result.success).toBe(true);
    const [url, options] = lastCall();
    expect(url).toBe(`${BASE_URL}/users`);
    expect(options.method).toBe("GET");
    expect(options.headers.Authorization).toBeUndefined();
    expect(options.body).toBeUndefined();
  });

  it("menyertakan bearer token dan query params (kosong diabaikan)", async () => {
    putAccessToken("tok");
    await apiFetch("/posts", {
      params: { is_me: 1, kosong: "", x: undefined, y: null, n: 0 },
    });
    const [url, options] = lastCall();
    expect(url).toBe(`${BASE_URL}/posts?is_me=1&n=0`);
    expect(options.headers.Authorization).toBe("Bearer tok");
  });

  it("tidak menyertakan token bila auth=false", async () => {
    putAccessToken("tok");
    await apiFetch("/auth/login", { auth: false });
    expect(lastCall()[1].headers.Authorization).toBeUndefined();
  });

  it("mengirim body urlencoded", async () => {
    await apiFetch("/auth/login", {
      method: "POST",
      body: { email: "a@b.c", n: 1 },
    });
    const options = lastCall()[1];
    expect(options.headers["Content-Type"]).toBe(
      "application/x-www-form-urlencoded"
    );
    expect(options.body).toBe("email=a%40b.c&n=1");
  });

  it("mengirim FormData apa adanya", async () => {
    const formData = new FormData();
    formData.append("cover", "x");
    await apiFetch("/x", { method: "POST", formData });
    const options = lastCall()[1];
    expect(options.body).toBe(formData);
    expect(options.headers["Content-Type"]).toBeUndefined();
  });

  it("menentukan sukses dari success boolean, status string, atau HTTP ok", async () => {
    const reply = (body: object, ok: boolean) =>
      (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok,
        json: () => Promise.resolve(body),
      });

    reply({ success: false, message: "x" }, true);
    expect((await apiFetch("/a")).success).toBe(false);

    reply({ success: true }, false);
    expect((await apiFetch("/a")).success).toBe(true);

    reply({ status: "success", message: "ok" }, true);
    expect((await apiFetch("/a")).success).toBe(true);

    reply({ status: "FAIL", message: "x" }, true);
    expect((await apiFetch("/a")).success).toBe(false);

    reply({ message: "Berhasil melakukan pendaftaran" }, true);
    expect((await apiFetch("/a")).success).toBe(true);

    reply({ message: "Tidak ditemukan" }, false);
    expect((await apiFetch("/a")).success).toBe(false);
  });

  it("mengembalikan objek gagal saat fetch error", async () => {
    (fetch as unknown as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error("jaringan putus")
    );
    expect(await apiFetch("/users")).toEqual({
      success: false,
      message: "jaringan putus",
      data: null,
    });
  });
});
