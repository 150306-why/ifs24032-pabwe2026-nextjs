import { describe, expect, it } from "vitest";
import * as R from "./reducer";
import { ActionType } from "./action";

const user = { id: 1, name: "A", email: "a@b.c" };
const other = { id: 2, name: "B", email: "b@b.c" };

describe("users reducer", () => {
  it("usersReducer", () => {
    expect(R.usersReducer()).toEqual([]);
    expect(R.usersReducer([user], { type: "X" })).toEqual([user]);
    expect(R.usersReducer([], { type: ActionType.SET_USERS, payload: { users: [other] } })).toEqual([other]);
  });

  it("userReducer", () => {
    expect(R.userReducer()).toBeNull();
    expect(R.userReducer(user, { type: "X" })).toEqual(user);
    expect(R.userReducer(null, { type: ActionType.SET_USER, payload: { user: other } })).toEqual(other);
  });

  it("profileReducer", () => {
    expect(R.profileReducer()).toBeNull();
    expect(R.profileReducer(user, { type: "X" })).toEqual(user);
    expect(R.profileReducer(null, { type: ActionType.SET_PROFILE, payload: { profile: other } })).toEqual(other);
  });

  it.each([
    ["isProfile", R.isProfileReducer, ActionType.SET_IS_PROFILE],
    ["isChangeProfile", R.isChangeProfileReducer, ActionType.SET_IS_CHANGE_PROFILE],
    ["isChangeProfilePhoto", R.isChangeProfilePhotoReducer, ActionType.SET_IS_CHANGE_PROFILE_PHOTO],
    ["isChangeProfilePassword", R.isChangeProfilePasswordReducer, ActionType.SET_IS_CHANGE_PROFILE_PASSWORD],
  ])("%s", (_n, reducer, type) => {
    expect(reducer()).toBe(false);
    expect(reducer(false, { type: "X" })).toBe(false);
    expect(reducer(false, { type, payload: { status: true } })).toBe(true);
  });
});
