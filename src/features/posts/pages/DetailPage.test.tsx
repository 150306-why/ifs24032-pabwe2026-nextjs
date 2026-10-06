import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("../api/postApi", () => ({
  default: {
    getPost: vi.fn(), putPost: vi.fn(), postPostCover: vi.fn(), deletePost: vi.fn(),
    postPostLike: vi.fn(), postPostComment: vi.fn(), deletePostComment: vi.fn(),
  },
}));
vi.mock("@/helpers/toolsHelper", () => ({
  showErrorDialog: vi.fn(),
  showSuccessDialog: vi.fn(),
  showWarningDialog: vi.fn(),
  showConfirmDialog: vi.fn(),
  formatDate: (v?: string) => `tgl:${v}`,
}));

import api from "../api/postApi";
import { showConfirmDialog, showWarningDialog } from "@/helpers/toolsHelper";
import { mockRouter, renderWithProviders } from "@/test-utils";
import type { Post } from "@/types";
import DetailPage from "./DetailPage";

const me = { id: 1, name: "Ani", email: "a@b.c" };
const base: Post = {
  id: 5, user_id: 1, description: "Isi postingan", cover: "http://x/c.png",
  created_at: "2026", updated_at: "2026",
  author: { id: 1, name: "Ani", photo: "http://x/a.png" },
  likes: [{ user_id: 2 }],
  comments: [
    { id: 10, user_id: 1, comment: "komentar saya", user: { id: 1, name: "Ani" }, created_at: "c1" },
    { id: 11, user_id: 2, comment: "komentar budi", user: null, created_at: "c2" },
  ],
};
const ok = { success: true, message: "ok", data: null };
const fail = { success: false, message: "err", data: null };

function mockDetail(post: Post = base) {
  vi.mocked(api.getPost).mockResolvedValue({ success: true, message: "", data: { post } });
}

function render(profile: typeof me | null = me) {
  return renderWithProviders(<DetailPage />, {
    route: "/posts/5",
    params: { postId: "5" },
    preloadedState: { profile },
  });
}

describe("DetailPage", () => {
  beforeEach(() => vi.clearAllMocks());

  it("menampilkan rincian postingan, pemilik, suka, dan komentar", async () => {
    mockDetail();
    render();
    expect(await screen.findByText("Isi postingan")).toBeInTheDocument();
    expect(api.getPost).toHaveBeenCalledWith("5");
    expect(screen.getByAltText("Cover postingan")).toHaveAttribute("src", "http://x/c.png");
    expect(screen.getByAltText("Ani")).toHaveAttribute("src", "http://x/a.png");
    expect(screen.getByText("Komentar (2)")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Ubah Postingan/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Suka \(1\)/ })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getAllByLabelText("Hapus komentar")).toHaveLength(1);
    expect(screen.getByText("Anonim")).toBeInTheDocument();
  });

  it("bukan pemilik: tidak ada aksi ubah/hapus; tanpa cover & tanpa penulis", async () => {
    mockDetail({ ...base, user_id: 2, cover: null, author: null, likes: undefined, comments: undefined });
    render();
    expect(await screen.findByText("Isi postingan")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Ubah Postingan/ })).not.toBeInTheDocument();
    expect(screen.queryByAltText("Cover postingan")).not.toBeInTheDocument();
    expect(screen.getByText("?")).toBeInTheDocument();
    expect(screen.getByText("Belum ada komentar.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Suka \(0\)/ })).toBeInTheDocument();
  });

  it("pemilik ditentukan dari author.id bila user_id tidak ada; penulis tanpa foto", async () => {
    mockDetail({ ...base, user_id: undefined, author: { id: 1, name: "ani" } });
    render();
    expect(await screen.findByText("Isi postingan")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Ubah Postingan/ })).toBeInTheDocument();
    expect(screen.getByText("A")).toBeInTheDocument();
  });

  it("tanpa profil: bukan pemilik dan belum menyukai", async () => {
    mockDetail();
    render(null);
    expect(await screen.findByText("Isi postingan")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Ubah Postingan/ })).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Hapus komentar")).not.toBeInTheDocument();
  });

  it("menampilkan loading dan pesan tidak ditemukan", async () => {
    vi.mocked(api.getPost).mockReturnValue(new Promise(() => {}));
    const { unmount } = render();
    expect(await screen.findByText("Memuat data...")).toBeInTheDocument();
    unmount();
    vi.mocked(api.getPost).mockResolvedValue(fail);
    render();
    expect(await screen.findByText("Postingan tidak ditemukan.")).toBeInTheDocument();
    expect(screen.getByText("Kembali ke beranda")).toHaveAttribute("href", "/");
  });

  it("like: memberi suka lalu memuat ulang", async () => {
    mockDetail();
    vi.mocked(api.postPostLike).mockResolvedValue(ok);
    render();
    await userEvent.click(await screen.findByRole("button", { name: /Suka \(1\)/ }));
    await waitFor(() => expect(api.postPostLike).toHaveBeenCalledWith("5", "like"));
    await waitFor(() => expect(vi.mocked(api.getPost).mock.calls.length).toBe(2));
  });

  it("mengenali like dari array id pengguna dan komentar dari my_comment", async () => {
    mockDetail({
      ...base,
      likes: [1, 3],
      comments: [{ id: 20, comment: "punya saya" }],
      my_comment: { id: 20, comment: "punya saya" },
    });
    render();
    expect(await screen.findByRole("button", { name: /Batal Suka \(2\)/ })).toBeInTheDocument();
    expect(screen.getByLabelText("Hapus komentar")).toBeInTheDocument();
  });

  it("unlike bila sudah menyukai", async () => {
    mockDetail({ ...base, likes: [{ user_id: 1 }] });
    vi.mocked(api.postPostLike).mockResolvedValue(ok);
    render();
    await userEvent.click(await screen.findByRole("button", { name: /Batal Suka \(1\)/ }));
    await waitFor(() => expect(api.postPostLike).toHaveBeenCalledWith("5", "unlike"));
  });

  it("like gagal tidak memuat ulang", async () => {
    mockDetail();
    vi.mocked(api.postPostLike).mockResolvedValue(fail);
    render();
    await userEvent.click(await screen.findByRole("button", { name: /Suka \(1\)/ }));
    await waitFor(() => expect(api.postPostLike).toHaveBeenCalled());
    expect(api.getPost).toHaveBeenCalledTimes(1);
  });

  it("komentar kosong ditolak", async () => {
    mockDetail();
    render();
    await screen.findByText("Isi postingan");
    await userEvent.click(screen.getByRole("button", { name: "Kirim" }));
    expect(showWarningDialog).toHaveBeenCalledWith("Komentar tidak boleh kosong.");
    expect(api.postPostComment).not.toHaveBeenCalled();
  });

  it("komentar berhasil: input dikosongkan dan data dimuat ulang", async () => {
    mockDetail();
    vi.mocked(api.postPostComment).mockResolvedValue(ok);
    render();
    await screen.findByText("Isi postingan");
    await userEvent.type(screen.getByLabelText("Tulis komentar"), "mantap");
    await userEvent.click(screen.getByRole("button", { name: "Kirim" }));
    await waitFor(() => expect(api.postPostComment).toHaveBeenCalledWith("5", "mantap"));
    await waitFor(() => expect(screen.getByLabelText("Tulis komentar")).toHaveValue(""));
    expect(vi.mocked(api.getPost).mock.calls.length).toBe(2);
  });

  it("komentar gagal mempertahankan input", async () => {
    mockDetail();
    vi.mocked(api.postPostComment).mockResolvedValue(fail);
    render();
    await screen.findByText("Isi postingan");
    await userEvent.type(screen.getByLabelText("Tulis komentar"), "mantap");
    await userEvent.click(screen.getByRole("button", { name: "Kirim" }));
    await waitFor(() => expect(api.postPostComment).toHaveBeenCalled());
    expect(screen.getByLabelText("Tulis komentar")).toHaveValue("mantap");
  });

  it("hapus komentar milik sendiri: berhasil dan gagal", async () => {
    mockDetail();
    vi.mocked(api.deletePostComment).mockResolvedValueOnce(ok);
    render();
    await userEvent.click(await screen.findByLabelText("Hapus komentar"));
    await waitFor(() => expect(api.deletePostComment).toHaveBeenCalledWith("5"));
    await waitFor(() => expect(vi.mocked(api.getPost).mock.calls.length).toBe(2));

    vi.mocked(api.deletePostComment).mockResolvedValueOnce(fail);
    await userEvent.click(screen.getByLabelText("Hapus komentar"));
    await waitFor(() => expect(api.deletePostComment).toHaveBeenCalledTimes(2));
    expect(vi.mocked(api.getPost).mock.calls.length).toBe(2);
  });

  it("ubah postingan melalui modal lalu memuat ulang", async () => {
    mockDetail();
    vi.mocked(api.putPost).mockResolvedValue(ok);
    render();
    await userEvent.click(await screen.findByRole("button", { name: /Ubah Postingan/ }));
    const dialog = screen.getByRole("dialog");
    await userEvent.click(within(dialog).getByRole("button", { name: "Simpan Perubahan" }));
    await waitFor(() => expect(vi.mocked(api.getPost).mock.calls.length).toBe(2));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("ubah cover melalui modal lalu memuat ulang", async () => {
    mockDetail();
    vi.mocked(api.postPostCover).mockResolvedValue(ok);
    URL.createObjectURL = vi.fn(() => "blob:p");
    render();
    await userEvent.click(await screen.findByRole("button", { name: /Ubah Cover/ }));
    const file = new File(["x"], "a.png", { type: "image/png" });
    fireEvent.change(screen.getByLabelText("Gambar Cover"), { target: { files: [file] } });
    await userEvent.click(screen.getByRole("button", { name: "Unggah" }));
    await waitFor(() => expect(vi.mocked(api.getPost).mock.calls.length).toBe(2));
  });

  it("hapus postingan: dibatalkan tetap di halaman", async () => {
    mockDetail();
    vi.mocked(showConfirmDialog).mockResolvedValue(false);
    render();
    await userEvent.click(await screen.findByRole("button", { name: /Hapus Postingan/ }));
    expect(api.deletePost).not.toHaveBeenCalled();
    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  it("hapus postingan: dikonfirmasi menuju beranda", async () => {
    mockDetail();
    vi.mocked(showConfirmDialog).mockResolvedValue(true);
    vi.mocked(api.deletePost).mockResolvedValue(ok);
    render();
    await userEvent.click(await screen.findByRole("button", { name: /Hapus Postingan/ }));
    await waitFor(() => expect(mockRouter.push).toHaveBeenCalledWith("/"));
    expect(api.deletePost).toHaveBeenCalledWith("5");
  });
});
