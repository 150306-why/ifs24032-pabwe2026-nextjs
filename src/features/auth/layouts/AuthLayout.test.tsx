import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import { mockRouter, renderWithProviders } from "@/test-utils";
import { putAccessToken } from "@/helpers/apiHelper";
import AuthLayout from "./AuthLayout";

describe("AuthLayout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("menampilkan banner dan children saat belum login", () => {
    renderWithProviders(<AuthLayout>isi form</AuthLayout>);
    expect(screen.getByTestId("auth-banner")).toBeInTheDocument();
    expect(screen.getByText("isi form")).toBeInTheDocument();
    expect(mockRouter.replace).not.toHaveBeenCalled();
  });

  it("mengalihkan ke beranda bila token ada", () => {
    putAccessToken("tok");
    renderWithProviders(<AuthLayout>x</AuthLayout>);
    expect(mockRouter.replace).toHaveBeenCalledWith("/");
  });

  it("mengalihkan ke beranda bila isAuthLogin true", () => {
    renderWithProviders(<AuthLayout>x</AuthLayout>, {
      preloadedState: { isAuthLogin: true },
    });
    expect(mockRouter.replace).toHaveBeenCalledWith("/");
  });
});
