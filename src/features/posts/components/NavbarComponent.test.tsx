import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockRouter, renderWithProviders } from "@/test-utils";
import { putAccessToken } from "@/helpers/apiHelper";
import NavbarComponent from "./NavbarComponent";

const user = { id: 1, name: "ani", email: "a@b.c" };

describe("NavbarComponent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("menampilkan nama dan inisial", () => {
    renderWithProviders(<NavbarComponent onToggleSidebar={() => {}} />, {
      preloadedState: { profile: user },
    });
    expect(screen.getByText("ani")).toBeInTheDocument();
    expect(screen.getByText("A")).toBeInTheDocument();
  });

  it("menampilkan foto bila ada", () => {
    renderWithProviders(<NavbarComponent onToggleSidebar={() => {}} />, {
      preloadedState: { profile: { ...user, photo: "http://x/a.png" } },
    });
    expect(screen.getByAltText("Avatar")).toHaveAttribute("src", "http://x/a.png");
  });

  it("fallback tanpa profil dan nama kosong", () => {
    const { unmount } = renderWithProviders(<NavbarComponent onToggleSidebar={() => {}} />);
    expect(screen.getByText("Pengguna")).toBeInTheDocument();
    expect(screen.getByText("?")).toBeInTheDocument();
    unmount();
    renderWithProviders(<NavbarComponent onToggleSidebar={() => {}} />, {
      preloadedState: { profile: { ...user, name: "" } },
    });
    expect(screen.getByText("?")).toBeInTheDocument();
  });

  it("tombol menu memanggil onToggleSidebar", async () => {
    const onToggle = vi.fn();
    renderWithProviders(<NavbarComponent onToggleSidebar={onToggle} />);
    await userEvent.click(screen.getByLabelText("Buka menu"));
    expect(onToggle).toHaveBeenCalled();
  });

  it("dropdown dibuka, ditutup, dan tautan profil menutupnya", async () => {
    renderWithProviders(<NavbarComponent onToggleSidebar={() => {}} />, {
      preloadedState: { profile: user },
    });
    expect(screen.queryByTestId("profile-dropdown")).not.toBeInTheDocument();
    await userEvent.click(screen.getByLabelText("Menu profil"));
    expect(screen.getByTestId("profile-dropdown")).toBeInTheDocument();
    await userEvent.click(screen.getByLabelText("Menu profil"));
    expect(screen.queryByTestId("profile-dropdown")).not.toBeInTheDocument();
    await userEvent.click(screen.getByLabelText("Menu profil"));
    const link = screen.getByText("Profil Saya");
    expect(link).toHaveAttribute("href", "/profile");
    await userEvent.click(link);
    expect(screen.queryByTestId("profile-dropdown")).not.toBeInTheDocument();
  });

  it("logout menghapus token dan menuju login", async () => {
    putAccessToken("tok");
    const { store } = renderWithProviders(<NavbarComponent onToggleSidebar={() => {}} />, {
      preloadedState: { profile: user, isProfile: true },
    });
    await userEvent.click(screen.getByLabelText("Menu profil"));
    await userEvent.click(screen.getByRole("button", { name: /Keluar/ }));
    expect(localStorage.getItem("accessToken")).toBeNull();
    expect(store.getState().profile).toBeNull();
    expect(store.getState().isAuthLogout).toBe(true);
    expect(mockRouter.push).toHaveBeenCalledWith("/auth/login");
  });
});
