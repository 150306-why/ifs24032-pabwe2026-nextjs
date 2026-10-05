import { render } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import type { ReactElement } from "react";
import { vi } from "vitest";
import { rootReducer } from "./store";
import type { RootState } from "./store";

/** Mock router next/navigation yang dipakai seluruh tes. */
export const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  back: vi.fn(),
  refresh: vi.fn(),
  prefetch: vi.fn(),
};

/** State navigasi yang bisa diatur per tes lewat renderWithProviders. */
export const nav = {
  pathname: "/",
  params: {} as Record<string, string>,
  search: new URLSearchParams(),
};

interface Options {
  preloadedState?: Partial<RootState>;
  route?: string;
  params?: Record<string, string>;
}

export function renderWithProviders(
  ui: ReactElement,
  { preloadedState, route = "/", params = {} }: Options = {}
) {
  const url = new URL(route, "http://localhost");
  nav.pathname = url.pathname;
  nav.search = url.searchParams;
  nav.params = params;

  const store = configureStore({ reducer: rootReducer, preloadedState });
  return { store, ...render(<Provider store={store}>{ui}</Provider>) };
}
