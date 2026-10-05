import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("../api/postApi", () => ({ default: { postPostCover: vi.fn() } }));
vi.mock("@/helpers/toolsHelper", () => ({
  showErrorDialog: vi.fn(),
  showSuccessDialog: vi.fn(),
  showWarningDialog: vi.fn(),
  showConfirmDialog: vi.fn(),
}));

import api from "../api/postApi";
import { showErrorDialog, showWarningDialog } from "@/helpers/toolsHelper";
import { renderWithProviders } from "@/test-utils";
import ChangeCoverModal from "./ChangeCoverModal";

const file = new File(["x"], "a.png", { type: "image/png" });
const pick = () =>
  fireEvent.change(screen.getByLabelText("Gambar Cover"), { target: { files: [file] } });

describe("ChangeCoverModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    URL.createObjectURL = vi.fn(() => "blob:preview");
  });

  it("tidak render saat tertutup", () => {
    renderWithProviders(<ChangeCoverModal open={false} postId={1} onClose={() => {}} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("peringatan jika belum memilih file", async () => {
    renderWithProviders(<ChangeCoverModal open postId={1} onClose={() => {}} />);
    await userEvent.click(screen.getByRole("button", { name: "Unggah" }));
    expect(showWarningDialog).toHaveBeenCalled();
    expect(api.postPostCover).not.toHaveBeenCalled();
  });

  it("pratinjau muncul lalu hilang saat pilihan dibatalkan", () => {
    renderWithProviders(<ChangeCoverModal open postId={1} onClose={() => {}} />);
    pick();
    expect(screen.getByAltText("Pratinjau cover")).toHaveAttribute("src", "blob:preview");
    fireEvent.change(screen.getByLabelText("Gambar Cover"), { target: { files: [] } });
    expect(screen.queryByAltText("Pratinjau cover")).not.toBeInTheDocument();
  });

  it("mengunggah cover lalu menutup dan memanggil onSuccess", async () => {
    vi.mocked(api.postPostCover).mockResolvedValue({ success: true, message: "ok", data: null });
    const onClose = vi.fn();
    const onSuccess = vi.fn();
    renderWithProviders(<ChangeCoverModal open postId={4} onClose={onClose} onSuccess={onSuccess} />);
    pick();
    await userEvent.click(screen.getByRole("button", { name: "Unggah" }));
    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(onSuccess).toHaveBeenCalled();
    expect(api.postPostCover).toHaveBeenCalledWith(4, file);
  });

  it("sukses tanpa onSuccess", async () => {
    vi.mocked(api.postPostCover).mockResolvedValue({ success: true, message: "ok", data: null });
    const onClose = vi.fn();
    renderWithProviders(<ChangeCoverModal open postId={4} onClose={onClose} />);
    pick();
    await userEvent.click(screen.getByRole("button", { name: "Unggah" }));
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  it("gagal tidak menutup modal", async () => {
    vi.mocked(api.postPostCover).mockResolvedValue({ success: false, message: "err", data: null });
    const onClose = vi.fn();
    renderWithProviders(<ChangeCoverModal open postId={4} onClose={onClose} />);
    pick();
    await userEvent.click(screen.getByRole("button", { name: "Unggah" }));
    await waitFor(() => expect(showErrorDialog).toHaveBeenCalledWith("err"));
    expect(onClose).not.toHaveBeenCalled();
  });

  it("tombol tutup", async () => {
    const onClose = vi.fn();
    renderWithProviders(<ChangeCoverModal open postId={1} onClose={onClose} />);
    await userEvent.click(screen.getByLabelText("Tutup"));
    expect(onClose).toHaveBeenCalled();
  });
});
