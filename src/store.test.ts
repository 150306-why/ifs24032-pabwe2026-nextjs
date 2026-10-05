import { describe, expect, it } from "vitest";
import store, { rootReducer } from "./store";

describe("store", () => {
  it("memiliki state awal dari seluruh slice", () => {
    const state = store.getState();
    expect(Object.keys(state).sort()).toEqual(
      Object.keys(rootReducer(undefined, { type: "@@INIT" })).sort()
    );
    expect(state.isAuthLogin).toBe(false);
    expect(state.users).toEqual([]);
    expect(state.profile).toBeNull();
    expect(state.posts).toEqual([]);
    expect(state.post).toBeNull();
  });

  it("merespons action", () => {
    store.dispatch({ type: "SET_IS_AUTH_LOGIN", payload: { status: true } });
    expect(store.getState().isAuthLogin).toBe(true);
  });
});
