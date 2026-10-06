import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../api/userApi", () => ({
  default: {
    getUsers: vi.fn(), getMe: vi.fn(), putMe: vi.fn(),
    postMePhoto: vi.fn(), putMePassword: vi.fn(),
  },
}));
vi.mock("@/helpers/toolsHelper", () => ({
  showErrorDialog: vi.fn(),
  showSuccessDialog: vi.fn(),
}));

import userApi from "../api/userApi";
import { showErrorDialog, showSuccessDialog } from "@/helpers/toolsHelper";
import type { AppDispatch } from "@/store";
import * as A from "./action";

const fail = { success: false, message: "gagal", data: null };
const ok = { success: true, message: "ok", data: null };
const fakeDispatch = (result: unknown = undefined) =>
  vi.fn().mockResolvedValue(result) as unknown as AppDispatch & ReturnType<typeof vi.fn>;

describe("users action", () => {
  beforeEach(() => vi.clearAllMocks());

  it("action creators", () => {
    const user = { id: 1, name: "A", email: "a@b.c" };
    expect(A.setUsersActionCreator([user])).toEqual({ type: A.ActionType.SET_USERS, payload: { users: [user] } });
    expect(A.setUserActionCreator(user)).toEqual({ type: A.ActionType.SET_USER, payload: { user } });
    expect(A.setProfileActionCreator(user)).toEqual({ type: A.ActionType.SET_PROFILE, payload: { profile: user } });
    expect(A.setIsProfileActionCreator(true)).toEqual({ type: A.ActionType.SET_IS_PROFILE, payload: { status: true } });
    expect(A.setIsChangeProfileActionCreator(true)).toEqual({ type: A.ActionType.SET_IS_CHANGE_PROFILE, payload: { status: true } });
    expect(A.setIsChangeProfilePhotoActionCreator(true)).toEqual({ type: A.ActionType.SET_IS_CHANGE_PROFILE_PHOTO, payload: { status: true } });
    expect(A.setIsChangeProfilePasswordActionCreator(true)).toEqual({ type: A.ActionType.SET_IS_CHANGE_PROFILE_PASSWORD, payload: { status: true } });
  });

  it("asyncSetUsers sukses & gagal", async () => {
    const users = [{ id: 1, name: "A", email: "a@b.c" }];
    vi.mocked(userApi.getUsers).mockResolvedValueOnce({ success: true, message: "", data: { users } });
    let dispatch = fakeDispatch();
    expect(await A.asyncSetUsers()(dispatch)).toBe(true);
    expect(dispatch).toHaveBeenCalledWith(A.setUsersActionCreator(users));

    vi.mocked(userApi.getUsers).mockResolvedValueOnce(fail);
    dispatch = fakeDispatch();
    expect(await A.asyncSetUsers()(dispatch)).toBe(false);
    expect(showErrorDialog).toHaveBeenCalledWith("gagal");
  });

  it("asyncSetProfile sukses & gagal", async () => {
    const user = { id: 1, name: "A", email: "a@b.c" };
    vi.mocked(userApi.getMe).mockResolvedValueOnce({ success: true, message: "", data: { user } });
    let dispatch = fakeDispatch();
    expect(await A.asyncSetProfile()(dispatch)).toBe(true);
    expect(dispatch).toHaveBeenCalledWith(A.setProfileActionCreator(user));
    expect(dispatch).toHaveBeenCalledWith(A.setIsProfileActionCreator(true));

    vi.mocked(userApi.getMe).mockResolvedValueOnce(fail);
    dispatch = fakeDispatch();
    expect(await A.asyncSetProfile()(dispatch)).toBe(false);
    expect(dispatch).toHaveBeenCalledWith(A.setProfileActionCreator(null));
  });

  it("asyncSetProfileWithRetry: berhasil di percobaan pertama", async () => {
    const dispatch = vi.fn().mockResolvedValueOnce(true) as unknown as AppDispatch;
    expect(await A.asyncSetProfileWithRetry()(dispatch)).toBe(true);
    expect(dispatch).toHaveBeenCalledTimes(1);
  });

  it("asyncSetProfileWithRetry: gagal sesaat lalu berhasil", async () => {
    const dispatch = vi
      .fn()
      .mockResolvedValueOnce(false)
      .mockResolvedValueOnce(true) as unknown as AppDispatch;
    expect(await A.asyncSetProfileWithRetry(2, 0)(dispatch)).toBe(true);
    expect(dispatch).toHaveBeenCalledTimes(2);
  });

  it("asyncSetProfileWithRetry: gagal di semua percobaan", async () => {
    const dispatch = vi.fn().mockResolvedValue(false) as unknown as AppDispatch;
    expect(await A.asyncSetProfileWithRetry(2, 0)(dispatch)).toBe(false);
    expect(dispatch).toHaveBeenCalledTimes(3);
  });

  it("asyncSetIsChangeProfile sukses & gagal", async () => {
    vi.mocked(userApi.putMe).mockResolvedValueOnce(ok);
    let dispatch = fakeDispatch(true);
    expect(await A.asyncSetIsChangeProfile({ name: "n", email: "e" })(dispatch)).toBe(true);
    expect(showSuccessDialog).toHaveBeenCalledWith("ok");
    expect(dispatch).toHaveBeenCalledWith(A.setIsChangeProfileActionCreator(true));
    expect(dispatch).toHaveBeenCalledWith(A.setIsChangeProfileActionCreator(false));

    vi.mocked(userApi.putMe).mockResolvedValueOnce(fail);
    dispatch = fakeDispatch();
    expect(await A.asyncSetIsChangeProfile({ name: "n", email: "e" })(dispatch)).toBe(false);
    expect(showErrorDialog).toHaveBeenCalledWith("gagal");
  });

  it("asyncSetIsChangeProfilePhoto sukses & gagal", async () => {
    const file = new File(["x"], "a.png");
    vi.mocked(userApi.postMePhoto).mockResolvedValueOnce(ok);
    let dispatch = fakeDispatch(true);
    expect(await A.asyncSetIsChangeProfilePhoto(file)(dispatch)).toBe(true);
    expect(dispatch).toHaveBeenCalledWith(A.setIsChangeProfilePhotoActionCreator(false));

    vi.mocked(userApi.postMePhoto).mockResolvedValueOnce(fail);
    dispatch = fakeDispatch();
    expect(await A.asyncSetIsChangeProfilePhoto(file)(dispatch)).toBe(false);
  });

  it("asyncSetIsChangeProfilePassword sukses & gagal", async () => {
    vi.mocked(userApi.putMePassword).mockResolvedValueOnce(ok);
    let dispatch = fakeDispatch();
    expect(await A.asyncSetIsChangeProfilePassword({ password: "a", newPassword: "b" })(dispatch)).toBe(true);
    expect(showSuccessDialog).toHaveBeenCalledWith("ok");

    vi.mocked(userApi.putMePassword).mockResolvedValueOnce(fail);
    dispatch = fakeDispatch();
    expect(await A.asyncSetIsChangeProfilePassword({ password: "a", newPassword: "b" })(dispatch)).toBe(false);
  });
});
