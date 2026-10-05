import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("../api/authApi", () => ({
  default: { postLogin: vi.fn(), postRegister: vi.fn() },
}));
vi.mock("@/helpers/toolsHelper", () => ({
  showErrorDialog: vi.fn(),
  showSuccessDialog: vi.fn(),
  showWarningDialog: vi.fn(),
}));

import authApi from "../api/authApi";
import { showErrorDialog, showWarningDialog } from "@/helpers/toolsHelper";
import { mockRouter, renderWithProviders } from "@/test-utils";
import RegisterPage from "./RegisterPage";

async function fill(password = "123456") {
  await userEvent.type(screen.getByLabelText("Nama"), "Ani");
  await userEvent.type(screen.getByLabelText("Email"), "a@b.c");
  if (password) await userEvent.type(screen.getByLabelText("Kata Sandi"), password);
}

describe("RegisterPage", () => {
  beforeEach(() => vi.clearAllMocks());

  it("memvalidasi input kosong", async () => {
    renderWithProviders(<RegisterPage />);
    await userEvent.click(screen.getByRole("button", { name: "Daftar" }));
    expect(showWarningDialog).toHaveBeenCalledWith("Nama, email, dan kata sandi wajib diisi.");
  });

  it("memvalidasi panjang kata sandi", async () => {
    renderWithProviders(<RegisterPage />);
    await fill("123");
    await userEvent.click(screen.getByRole("button", { name: "Daftar" }));
    expect(showWarningDialog).toHaveBeenCalledWith("Kata sandi minimal 6 karakter.");
    expect(authApi.postRegister).not.toHaveBeenCalled();
  });

  it("registrasi berhasil menuju login", async () => {
    vi.mocked(authApi.postRegister).mockResolvedValue({ success: true, message: "ok", data: null });
    renderWithProviders(<RegisterPage />);
    await fill();
    await userEvent.click(screen.getByRole("button", { name: "Daftar" }));
    await waitFor(() => expect(mockRouter.push).toHaveBeenCalledWith("/auth/login"));
  });

  it("registrasi gagal", async () => {
    vi.mocked(authApi.postRegister).mockResolvedValue({ success: false, message: "dup", data: null });
    renderWithProviders(<RegisterPage />);
    await fill();
    await userEvent.click(screen.getByRole("button", { name: "Daftar" }));
    await waitFor(() => expect(showErrorDialog).toHaveBeenCalledWith("dup"));
    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  it("tautan ke login", () => {
    renderWithProviders(<RegisterPage />);
    expect(screen.getByRole("link", { name: "Masuk" })).toHaveAttribute("href", "/auth/login");
  });
});
