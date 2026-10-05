import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("sweetalert2", () => ({ default: { fire: vi.fn() } }));

import Swal from "sweetalert2";
import {
  formatDate,
  showConfirmDialog,
  showErrorDialog,
  showSuccessDialog,
  showWarningDialog,
} from "./toolsHelper";

const fire = Swal.fire as unknown as ReturnType<typeof vi.fn>;

describe("toolsHelper", () => {
  beforeEach(() => {
    fire.mockReset();
    fire.mockResolvedValue({ isConfirmed: true });
  });

  it("showSuccessDialog", async () => {
    await showSuccessDialog("sukses");
    expect(fire).toHaveBeenCalledWith(
      expect.objectContaining({ icon: "success", text: "sukses" })
    );
  });

  it("showErrorDialog", async () => {
    await showErrorDialog("gagal");
    expect(fire).toHaveBeenCalledWith(
      expect.objectContaining({ icon: "error", text: "gagal" })
    );
  });

  it("showWarningDialog", async () => {
    await showWarningDialog("awas");
    expect(fire).toHaveBeenCalledWith(
      expect.objectContaining({ icon: "warning", text: "awas" })
    );
  });

  it("showConfirmDialog true dengan teks default", async () => {
    expect(await showConfirmDialog("yakin?")).toBe(true);
    expect(fire).toHaveBeenCalledWith(
      expect.objectContaining({ confirmButtonText: "Ya, lanjutkan" })
    );
  });

  it("showConfirmDialog false dengan teks kustom", async () => {
    fire.mockResolvedValue({ isConfirmed: false });
    expect(await showConfirmDialog("yakin?", "Hapus")).toBe(false);
    expect(fire).toHaveBeenCalledWith(
      expect.objectContaining({ confirmButtonText: "Hapus" })
    );
  });

  it("formatDate", () => {
    expect(formatDate(null)).toBe("-");
    expect(formatDate(undefined)).toBe("-");
    expect(formatDate("bukan-tanggal")).toBe("-");
    const text = formatDate("2026-03-05T10:00:00Z");
    expect(text).toContain("2026");
    expect(text).toContain("Maret");
  });
});
