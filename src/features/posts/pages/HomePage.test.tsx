import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("../api/postApi", () => ({
  default: { getPosts: vi.fn(), postPost: vi.fn(), deletePosts: vi.fn() },
}));
vi.mock("@/helpers/toolsHelper", () => ({
  showErrorDialog: vi.fn(),
  showSuccessDialog: vi.fn(),
  showWarningDialog: vi.fn(),
  showConfirmDialog: vi.fn(),
  formatDate: (v?: string) => `tgl:${v}`,
}));

import api from "../api/postApi";
import { showConfirmDialog } from "@/helpers/toolsHelper";
import { renderWithProviders } from "@/test-utils";
import HomePage from "./HomePage";

const posts = [
  {
    id: 1, description: "Hari yang cerah", created_at: "d1", cover: "http://x/c.png",
    author: { id: 1, name: "Ani" }, likes: [{ user_id: 1 }, { user_id: 2 }], comments: [{ id: 1, comment: "x" }],
  },
  { id: 2, description: "Belajar NextJS", created_at: "d2", author: { id: 2, name: "Budi" }, likes: [], comments: [] },
  { id: 3, description: "Tanpa penulis", created_at: "d3", author: null },
];

function mockList(list = posts) {
  vi.mocked(api.getPosts).mockResolvedValue({ success: true, message: "", data: { posts: list } });
}

describe("HomePage", () => {
  beforeEach(() => vi.clearAllMocks());

  it("menampilkan daftar postingan, jumlah suka & komentar", async () => {
    mockList();
    renderWithProviders(<HomePage />);
    expect(await screen.findByText("Hari yang cerah")).toBeInTheDocument();
    expect(api.getPosts).toHaveBeenCalledWith({ is_me: "" });
    expect(screen.getByRole("heading", { name: "Semua Postingan" })).toBeInTheDocument();
    expect(screen.getByAltText("Cover postingan")).toHaveAttribute("src", "http://x/c.png");
    expect(screen.getByText("Anonim")).toBeInTheDocument();
    expect(screen.getByText("Hari yang cerah").closest("a")).toHaveAttribute("href", "/posts/1");
    expect(screen.queryByRole("button", { name: /Hapus Semua/ })).not.toBeInTheDocument();
  });

  it("menampilkan loading dan kondisi kosong", async () => {
    let resolve!: (v: unknown) => void;
    vi.mocked(api.getPosts).mockReturnValue(new Promise((r) => (resolve = r)) as never);
    renderWithProviders(<HomePage />);
    expect(await screen.findByText("Memuat data...")).toBeInTheDocument();
    resolve({ success: true, message: "", data: { posts: [] } });
    expect(await screen.findByText("Tidak ada postingan.")).toBeInTheDocument();
  });

  it("live search berdasarkan deskripsi dan nama pembuat", async () => {
    mockList();
    renderWithProviders(<HomePage />);
    await screen.findByText("Hari yang cerah");
    const input = screen.getByLabelText("Cari postingan");
    await userEvent.type(input, "nextjs");
    expect(screen.queryByText("Hari yang cerah")).not.toBeInTheDocument();
    expect(screen.getByText("Belajar NextJS")).toBeInTheDocument();
    await userEvent.clear(input);
    await userEvent.type(input, "ani");
    expect(screen.getByText("Hari yang cerah")).toBeInTheDocument();
    expect(screen.queryByText("Belajar NextJS")).not.toBeInTheDocument();
    await userEvent.clear(input);
    await userEvent.type(input, "penulis");
    expect(screen.getByText("Tanpa penulis")).toBeInTheDocument();
    await userEvent.clear(input);
    await userEvent.type(input, "zzz");
    expect(screen.getByText("Tidak ada postingan.")).toBeInTheDocument();
  });

  it("filter=me memanggil API dengan is_me dan menampilkan tab aktif", async () => {
    mockList();
    renderWithProviders(<HomePage />, { route: "/?filter=me" });
    expect(await screen.findByText("Hari yang cerah")).toBeInTheDocument();
    expect(api.getPosts).toHaveBeenCalledWith({ is_me: 1 });
    expect(screen.getByRole("heading", { name: "Postingan Saya" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Linimasa" })).toHaveAttribute("href", "/");
  });

  it("hapus semua: dibatalkan tidak memuat ulang", async () => {
    mockList();
    vi.mocked(showConfirmDialog).mockResolvedValue(false);
    renderWithProviders(<HomePage />, { route: "/?filter=me" });
    await screen.findByText("Hari yang cerah");
    const before = vi.mocked(api.getPosts).mock.calls.length;
    await userEvent.click(screen.getByRole("button", { name: /Hapus Semua/ }));
    expect(api.deletePosts).not.toHaveBeenCalled();
    expect(vi.mocked(api.getPosts).mock.calls.length).toBe(before);
  });

  it("hapus semua: dikonfirmasi memuat ulang daftar", async () => {
    mockList();
    vi.mocked(showConfirmDialog).mockResolvedValue(true);
    vi.mocked(api.deletePosts).mockResolvedValue({ success: true, message: "ok", data: null });
    renderWithProviders(<HomePage />, { route: "/?filter=me" });
    await screen.findByText("Hari yang cerah");
    const before = vi.mocked(api.getPosts).mock.calls.length;
    await userEvent.click(screen.getByRole("button", { name: /Hapus Semua/ }));
    await waitFor(() => expect(vi.mocked(api.getPosts).mock.calls.length).toBeGreaterThan(before));
    expect(api.deletePosts).toHaveBeenCalled();
  });

  it("tambah postingan memuat ulang daftar", async () => {
    mockList();
    vi.mocked(api.postPost).mockResolvedValue({ success: true, message: "ok", data: null });
    renderWithProviders(<HomePage />);
    await screen.findByText("Hari yang cerah");
    const before = vi.mocked(api.getPosts).mock.calls.length;
    await userEvent.click(screen.getByRole("button", { name: /Tambah Postingan/ }));
    const dialog = screen.getByRole("dialog");
    await userEvent.type(within(dialog).getByLabelText("Deskripsi"), "Baru");
    await userEvent.click(within(dialog).getByRole("button", { name: "Publikasikan" }));
    await waitFor(() => expect(vi.mocked(api.getPosts).mock.calls.length).toBeGreaterThan(before));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("menutup modal tambah", async () => {
    mockList();
    renderWithProviders(<HomePage />);
    await screen.findByText("Hari yang cerah");
    await userEvent.click(screen.getByRole("button", { name: /Tambah Postingan/ }));
    await userEvent.click(screen.getByLabelText("Tutup"));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
