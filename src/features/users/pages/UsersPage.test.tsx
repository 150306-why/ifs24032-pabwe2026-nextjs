import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("../api/userApi", () => ({ default: { getUsers: vi.fn() } }));
vi.mock("@/helpers/toolsHelper", () => ({
  showErrorDialog: vi.fn(),
  showSuccessDialog: vi.fn(),
}));

import userApi from "../api/userApi";
import { renderWithProviders } from "@/test-utils";
import UsersPage from "./UsersPage";

const users = [
  { id: 1, name: "Ani", email: "ani@x.id", photo: "http://x/a.png" },
  { id: 2, name: "budi", email: "budi@y.id", photo: null },
];

describe("UsersPage", () => {
  beforeEach(() => vi.clearAllMocks());

  it("menampilkan pesan saat kosong", async () => {
    vi.mocked(userApi.getUsers).mockResolvedValue({ success: true, message: "", data: { users: [] } });
    renderWithProviders(<UsersPage />);
    expect(await screen.findByText("Tidak ada pengguna.")).toBeInTheDocument();
  });

  it("menampilkan pengguna dengan foto dan inisial", async () => {
    vi.mocked(userApi.getUsers).mockResolvedValue({ success: true, message: "", data: { users } });
    renderWithProviders(<UsersPage />);
    expect(await screen.findByText("Ani")).toBeInTheDocument();
    expect(screen.getByAltText("Ani")).toHaveAttribute("src", "http://x/a.png");
    expect(screen.getByText("B")).toBeInTheDocument();
  });

  it("live search berdasarkan nama atau email", async () => {
    vi.mocked(userApi.getUsers).mockResolvedValue({ success: true, message: "", data: { users } });
    renderWithProviders(<UsersPage />);
    await screen.findByText("Ani");
    const input = screen.getByLabelText("Cari pengguna");
    await userEvent.type(input, "budi");
    expect(screen.queryByText("Ani")).not.toBeInTheDocument();
    await userEvent.clear(input);
    await userEvent.type(input, "ani@x");
    expect(screen.getByText("Ani")).toBeInTheDocument();
    expect(screen.queryByText("budi")).not.toBeInTheDocument();
    await userEvent.clear(input);
    await userEvent.type(input, "zzz");
    expect(screen.getByText("Tidak ada pengguna.")).toBeInTheDocument();
  });
});
