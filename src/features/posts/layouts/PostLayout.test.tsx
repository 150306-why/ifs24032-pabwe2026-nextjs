import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("@/features/users/api/userApi", () => ({
  default: { getMe: vi.fn() },
}));

import userApi from "@/features/users/api/userApi";
import { mockRouter, renderWithProviders } from "@/test-utils";
import { putAccessToken } from "@/helpers/apiHelper";
import PostLayout from "./PostLayout";

const me = { success: true, message: "", data: { user: { id: 1, name: "Ani", email: "a@b.c" } } };

describe("PostLayout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("tanpa token: mengalihkan ke login dan menampilkan loading", () => {
    renderWithProviders(<PostLayout>konten</PostLayout>);
    expect(mockRouter.replace).toHaveBeenCalledWith("/auth/login");
    expect(userApi.getMe).not.toHaveBeenCalled();
    expect(screen.getByText("Memuat sesi...")).toBeInTheDocument();
  });

  it("dengan token: memuat profil lalu menampilkan layout dan konten", async () => {
    putAccessToken("tok");
    vi.mocked(userApi.getMe).mockResolvedValue(me);
    renderWithProviders(<PostLayout>konten</PostLayout>);
    expect(screen.getByText("Memuat sesi...")).toBeInTheDocument();
    expect(await screen.findByText("konten")).toBeInTheDocument();
    expect(screen.getByText("Ani")).toBeInTheDocument();
    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
    expect(mockRouter.replace).not.toHaveBeenCalled();
  });

  it("toggle drawer sidebar dari navbar", async () => {
    putAccessToken("tok");
    vi.mocked(userApi.getMe).mockResolvedValue(me);
    renderWithProviders(<PostLayout>konten</PostLayout>);
    await screen.findByText("konten");
    await userEvent.click(screen.getByLabelText("Buka menu"));
    expect(screen.getByTestId("sidebar-overlay")).toBeInTheDocument();
    await userEvent.click(screen.getByTestId("sidebar-overlay"));
    expect(screen.queryByTestId("sidebar-overlay")).not.toBeInTheDocument();
  });

  it("sesi tidak valid: logout otomatis dan menuju login", async () => {
    putAccessToken("expired");
    vi.mocked(userApi.getMe).mockResolvedValue({ success: false, message: "Unauthorized", data: null });
    renderWithProviders(<PostLayout>konten</PostLayout>);
    await waitFor(() => expect(mockRouter.replace).toHaveBeenCalledWith("/auth/login"));
    expect(localStorage.getItem("accessToken")).toBeNull();
    expect(screen.queryByText("konten")).not.toBeInTheDocument();
  });
});
