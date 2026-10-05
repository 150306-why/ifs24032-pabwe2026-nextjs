import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../api/authApi", () => ({
  default: { postLogin: vi.fn(), postRegister: vi.fn() },
}));
vi.mock("@/helpers/apiHelper", () => ({
  putAccessToken: vi.fn(),
  removeAccessToken: vi.fn(),
}));
vi.mock("@/helpers/toolsHelper", () => ({
  showErrorDialog: vi.fn(),
  showSuccessDialog: vi.fn(),
}));

import authApi from "../api/authApi";
import { putAccessToken, removeAccessToken } from "@/helpers/apiHelper";
import { showErrorDialog, showSuccessDialog } from "@/helpers/toolsHelper";
import type { AppDispatch } from "@/store";
import {
  ActionType,
  asyncSetIsAuthLogin,
  asyncSetIsAuthLogout,
  asyncSetIsAuthRegister,
  setIsAuthLoginActionCreator,
  setIsAuthLogoutActionCreator,
  setIsAuthRegisterActionCreator,
} from "./action";
import { ActionType as UserActionType } from "@/features/users/states/action";

const fakeDispatch = () => vi.fn() as unknown as AppDispatch & ReturnType<typeof vi.fn>;

describe("auth action", () => {
  beforeEach(() => vi.clearAllMocks());

  it("action creators", () => {
    expect(setIsAuthLoginActionCreator(true)).toEqual({
      type: ActionType.SET_IS_AUTH_LOGIN, payload: { status: true },
    });
    expect(setIsAuthRegisterActionCreator(true)).toEqual({
      type: ActionType.SET_IS_AUTH_REGISTER, payload: { status: true },
    });
    expect(setIsAuthLogoutActionCreator(true)).toEqual({
      type: ActionType.SET_IS_AUTH_LOGOUT, payload: { status: true },
    });
  });

  it("login sukses", async () => {
    vi.mocked(authApi.postLogin).mockResolvedValue({ success: true, message: "", data: { token: "T" } });
    const dispatch = fakeDispatch();
    expect(await asyncSetIsAuthLogin({ email: "a", password: "b" })(dispatch)).toBe(true);
    expect(putAccessToken).toHaveBeenCalledWith("T");
    expect(dispatch).toHaveBeenCalledWith(setIsAuthLogoutActionCreator(false));
    expect(dispatch).toHaveBeenCalledWith(setIsAuthLoginActionCreator(true));
  });

  it("login gagal", async () => {
    vi.mocked(authApi.postLogin).mockResolvedValue({ success: false, message: "salah", data: null });
    const dispatch = fakeDispatch();
    expect(await asyncSetIsAuthLogin({ email: "a", password: "b" })(dispatch)).toBe(false);
    expect(showErrorDialog).toHaveBeenCalledWith("salah");
    expect(dispatch).not.toHaveBeenCalled();
  });

  it("register sukses", async () => {
    vi.mocked(authApi.postRegister).mockResolvedValue({ success: true, message: "ok", data: null });
    const dispatch = fakeDispatch();
    expect(await asyncSetIsAuthRegister({ name: "n", email: "e", password: "p" })(dispatch)).toBe(true);
    expect(dispatch).toHaveBeenCalledWith(setIsAuthRegisterActionCreator(true));
    expect(showSuccessDialog).toHaveBeenCalledWith("ok");
  });

  it("register gagal", async () => {
    vi.mocked(authApi.postRegister).mockResolvedValue({ success: false, message: "dup", data: null });
    const dispatch = fakeDispatch();
    expect(await asyncSetIsAuthRegister({ name: "n", email: "e", password: "p" })(dispatch)).toBe(false);
    expect(showErrorDialog).toHaveBeenCalledWith("dup");
  });

  it("logout", () => {
    const dispatch = fakeDispatch();
    asyncSetIsAuthLogout()(dispatch);
    expect(removeAccessToken).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith({
      type: UserActionType.SET_PROFILE, payload: { profile: null },
    });
    expect(dispatch).toHaveBeenCalledWith({
      type: UserActionType.SET_IS_PROFILE, payload: { status: false },
    });
    expect(dispatch).toHaveBeenCalledWith(setIsAuthLoginActionCreator(false));
    expect(dispatch).toHaveBeenCalledWith(setIsAuthRegisterActionCreator(false));
    expect(dispatch).toHaveBeenCalledWith(setIsAuthLogoutActionCreator(true));
  });
});
