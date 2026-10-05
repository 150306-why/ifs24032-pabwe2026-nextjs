import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test-utils";
import SidebarComponent, { MENUS } from "./SidebarComponent";

const current = (label: string) =>
  screen.getByText(label).closest("a")!.getAttribute("aria-current");

describe("SidebarComponent", () => {
  it("menampilkan seluruh menu dengan href yang benar", () => {
    renderWithProviders(<SidebarComponent open={false} onClose={() => {}} />);
    MENUS.forEach((menu) => {
      expect(screen.getByText(menu.label).closest("a")).toHaveAttribute("href", menu.href);
    });
    expect(screen.getByTestId("sidebar").className).toContain("-translate-x-full");
    expect(screen.queryByTestId("sidebar-overlay")).not.toBeInTheDocument();
  });

  it("menandai menu aktif: Semua Postingan", () => {
    renderWithProviders(<SidebarComponent open={false} onClose={() => {}} />, { route: "/" });
    expect(current("Semua Postingan")).toBe("page");
    expect(current("Postingan Saya")).toBeNull();
  });

  it("menandai menu aktif: Postingan Saya", () => {
    renderWithProviders(<SidebarComponent open={false} onClose={() => {}} />, { route: "/?filter=me" });
    expect(current("Postingan Saya")).toBe("page");
    expect(current("Semua Postingan")).toBeNull();
  });

  it("menandai menu aktif: Daftar Pengguna & Profil", () => {
    const { unmount } = renderWithProviders(<SidebarComponent open={false} onClose={() => {}} />, { route: "/users" });
    expect(current("Daftar Pengguna")).toBe("page");
    expect(current("Semua Postingan")).toBeNull();
    unmount();
    renderWithProviders(<SidebarComponent open={false} onClose={() => {}} />, { route: "/profile" });
    expect(current("Profil Saya")).toBe("page");
  });

  it("drawer terbuka menampilkan overlay dan bisa ditutup", async () => {
    const onClose = vi.fn();
    renderWithProviders(<SidebarComponent open onClose={onClose} />);
    expect(screen.getByTestId("sidebar").className).toContain("translate-x-0");
    await userEvent.click(screen.getByTestId("sidebar-overlay"));
    await userEvent.click(screen.getByLabelText("Tutup menu"));
    await userEvent.click(screen.getByText("Daftar Pengguna"));
    expect(onClose).toHaveBeenCalledTimes(3);
  });
});
