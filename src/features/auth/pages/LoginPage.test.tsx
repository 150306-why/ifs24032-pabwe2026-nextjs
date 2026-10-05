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
import LoginPage from "./LoginPage";

async function fill() {
  await userEvent.type(screen.getByLabelText("Email"), "a@b.c");
  await userEvent.type(screen.getByLabelText("Kata Sandi"), "123456");
}

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("memvalidasi input kosong", async () => {
    renderWithProviders(<LoginPage />);
    await userEvent.click(screen.getByRole("button", { name: "Masuk" }));
    expect(showWarningDialog).toHaveBeenCalled();
    expect(authApi.postLogin).not.toHaveBeenCalled();
  });

  it("login berhasil menuju beranda", async () => {
    vi.mocked(authApi.postLogin).mockResolvedValue({ success: true, message: "", data: { token: "T" } });
    renderWithProviders(<LoginPage />);
    await fill();
    await userEvent.click(screen.getByRole("button", { name: "Masuk" }));
    await waitFor(() => expect(mockRouter.push).toHaveBeenCalledWith("/"));
    expect(localStorage.getItem("accessToken")).toBe("T");
  });

  it("login gagal tidak berpindah halaman", async () => {
    vi.mocked(authApi.postLogin).mockResolvedValue({ success: false, message: "salah", data: null });
    renderWithProviders(<LoginPage />);
    await fill();
    await userEvent.click(screen.getByRole("button", { name: "Masuk" }));
    await waitFor(() => expect(showErrorDialog).toHaveBeenCalledWith("salah"));
    expect(mockRouter.push).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Masuk" })).toBeEnabled();
  });

  it("tautan ke register", () => {
    renderWithProviders(<LoginPage />);
    expect(screen.getByRole("link", { name: "Daftar" })).toHaveAttribute("href", "/auth/register");
  });
});
