import { describe, expect, it } from "vitest";
import {
  isAuthLoginReducer,
  isAuthLogoutReducer,
  isAuthRegisterReducer,
} from "./reducer";
import { ActionType } from "./action";

describe("auth reducer", () => {
  it.each([
    ["login", isAuthLoginReducer, ActionType.SET_IS_AUTH_LOGIN],
    ["register", isAuthRegisterReducer, ActionType.SET_IS_AUTH_REGISTER],
    ["logout", isAuthLogoutReducer, ActionType.SET_IS_AUTH_LOGOUT],
  ])("%s", (_name, reducer, type) => {
    expect(reducer()).toBe(false);
    expect(reducer(false, { type: "LAIN" })).toBe(false);
    expect(reducer(false, { type, payload: { status: true } })).toBe(true);
  });
});
