import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("../api/postApi", () => ({ default: { postPost: vi.fn() } }));
vi.mock("@/helpers/toolsHelper", () => ({
  showErrorDialog: vi.fn(),
  showSuccessDialog: vi.fn(),
  showWarningDialog: vi.fn(),
  showConfirmDialog: vi.fn(),
}));

import api from "../api/postApi";
import { showErrorDialog, showWarningDialog } from "@/helpers/toolsHelper";
import { renderWithProviders } from "@/test-utils";
import AddModal from "./AddModal";

describe("AddModal", () => {
  beforeEach(() => vi.clearAllMocks());

  it("tidak render saat tertutup", () => {
    renderWithProviders(<AddModal open={false} onClose={() => {}} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("validasi deskripsi kosong", async () => {
    renderWithProviders(<AddModal open onClose={() => {}} />);
    await userEvent.click(screen.getByRole("button", { name: "Publikasikan" }));
    expect(showWarningDialog).toHaveBeenCalled();
    expect(api.postPost).not.toHaveBeenCalled();
  });

  it("menambah postingan lalu menutup dan memanggil onSuccess", async () => {
    vi.mocked(api.postPost).mockResolvedValue({ success: true, message: "ok", data: null });
    const onClose = vi.fn();
    const onSuccess = vi.fn();
    renderWithProviders(<AddModal open onClose={onClose} onSuccess={onSuccess} />);
    await userEvent.type(screen.getByLabelText("Deskripsi"), "Halo dunia");
    await userEvent.click(screen.getByRole("button", { name: "Publikasikan" }));
    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(onSuccess).toHaveBeenCalled();
    expect(api.postPost).toHaveBeenCalledWith({ description: "Halo dunia" });
  });

  it("sukses tanpa onSuccess", async () => {
    vi.mocked(api.postPost).mockResolvedValue({ success: true, message: "ok", data: null });
    const onClose = vi.fn();
    renderWithProviders(<AddModal open onClose={onClose} />);
    await userEvent.type(screen.getByLabelText("Deskripsi"), "x");
    await userEvent.click(screen.getByRole("button", { name: "Publikasikan" }));
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  it("gagal tidak menutup modal", async () => {
    vi.mocked(api.postPost).mockResolvedValue({ success: false, message: "err", data: null });
    const onClose = vi.fn();
    renderWithProviders(<AddModal open onClose={onClose} />);
    await userEvent.type(screen.getByLabelText("Deskripsi"), "x");
    await userEvent.click(screen.getByRole("button", { name: "Publikasikan" }));
    await waitFor(() => expect(showErrorDialog).toHaveBeenCalledWith("err"));
    expect(onClose).not.toHaveBeenCalled();
  });

  it("tombol tutup", async () => {
    const onClose = vi.fn();
    renderWithProviders(<AddModal open onClose={onClose} />);
    await userEvent.click(screen.getByLabelText("Tutup"));
    expect(onClose).toHaveBeenCalled();
  });
});
