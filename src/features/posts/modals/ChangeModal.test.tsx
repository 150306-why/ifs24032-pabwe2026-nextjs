import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("../api/postApi", () => ({ default: { putPost: vi.fn() } }));
vi.mock("@/helpers/toolsHelper", () => ({
  showErrorDialog: vi.fn(),
  showSuccessDialog: vi.fn(),
  showWarningDialog: vi.fn(),
  showConfirmDialog: vi.fn(),
}));

import api from "../api/postApi";
import { showErrorDialog, showWarningDialog } from "@/helpers/toolsHelper";
import { renderWithProviders } from "@/test-utils";
import ChangeModal from "./ChangeModal";

const post = { id: 7, description: "Awal" };

describe("ChangeModal", () => {
  beforeEach(() => vi.clearAllMocks());

  it("tidak render saat tertutup atau tanpa data", () => {
    const { unmount } = renderWithProviders(<ChangeModal open={false} post={post} onClose={() => {}} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    unmount();
    renderWithProviders(<ChangeModal open post={null} onClose={() => {}} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("terisi data awal", () => {
    renderWithProviders(<ChangeModal open post={post} onClose={() => {}} />);
    expect(screen.getByLabelText("Deskripsi")).toHaveValue("Awal");
  });

  it("validasi deskripsi kosong", async () => {
    renderWithProviders(<ChangeModal open post={post} onClose={() => {}} />);
    await userEvent.clear(screen.getByLabelText("Deskripsi"));
    await userEvent.click(screen.getByRole("button", { name: "Simpan Perubahan" }));
    expect(showWarningDialog).toHaveBeenCalled();
    expect(api.putPost).not.toHaveBeenCalled();
  });

  it("menyimpan perubahan lalu menutup dan memanggil onSuccess", async () => {
    vi.mocked(api.putPost).mockResolvedValue({ success: true, message: "ok", data: null });
    const onClose = vi.fn();
    const onSuccess = vi.fn();
    renderWithProviders(<ChangeModal open post={post} onClose={onClose} onSuccess={onSuccess} />);
    await userEvent.type(screen.getByLabelText("Deskripsi"), " baru");
    await userEvent.click(screen.getByRole("button", { name: "Simpan Perubahan" }));
    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(onSuccess).toHaveBeenCalled();
    expect(api.putPost).toHaveBeenCalledWith(7, { description: "Awal baru" });
  });

  it("sukses tanpa onSuccess", async () => {
    vi.mocked(api.putPost).mockResolvedValue({ success: true, message: "ok", data: null });
    const onClose = vi.fn();
    renderWithProviders(<ChangeModal open post={post} onClose={onClose} />);
    await userEvent.click(screen.getByRole("button", { name: "Simpan Perubahan" }));
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  it("gagal tidak menutup modal", async () => {
    vi.mocked(api.putPost).mockResolvedValue({ success: false, message: "err", data: null });
    const onClose = vi.fn();
    renderWithProviders(<ChangeModal open post={post} onClose={onClose} />);
    await userEvent.click(screen.getByRole("button", { name: "Simpan Perubahan" }));
    await waitFor(() => expect(showErrorDialog).toHaveBeenCalledWith("err"));
    expect(onClose).not.toHaveBeenCalled();
  });

  it("tombol tutup", async () => {
    const onClose = vi.fn();
    renderWithProviders(<ChangeModal open post={post} onClose={onClose} />);
    await userEvent.click(screen.getByLabelText("Tutup"));
    expect(onClose).toHaveBeenCalled();
  });
});
