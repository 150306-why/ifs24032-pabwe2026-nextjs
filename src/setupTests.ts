import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

// Mock navigasi Next.js (App Router) untuk seluruh tes.
vi.mock("next/navigation", async () => {
  const utils = await import("./test-utils");
  return {
    useRouter: () => utils.mockRouter,
    usePathname: () => utils.nav.pathname,
    useSearchParams: () => utils.nav.search,
    useParams: () => utils.nav.params,
  };
});

afterEach(() => {
  cleanup();
});
