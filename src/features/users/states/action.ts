import userApi from "../api/userApi";
import { showErrorDialog, showSuccessDialog } from "@/helpers/toolsHelper";
import type { AppDispatch } from "@/store";
import type { User } from "@/types";
import type {
  ChangePasswordValues,
  ChangeProfileValues,
  ProfilePayload,
  StatusPayload,
  UserPayload,
  UsersPayload,
} from "@/types/action";

export const ActionType = {
  SET_USERS: "SET_USERS",
  SET_USER: "SET_USER",
  SET_PROFILE: "SET_PROFILE",
  SET_IS_PROFILE: "SET_IS_PROFILE",
  SET_IS_CHANGE_PROFILE: "SET_IS_CHANGE_PROFILE",
  SET_IS_CHANGE_PROFILE_PHOTO: "SET_IS_CHANGE_PROFILE_PHOTO",
  SET_IS_CHANGE_PROFILE_PASSWORD: "SET_IS_CHANGE_PROFILE_PASSWORD",
} as const;

type Types = typeof ActionType;

export interface UsersAction {
  type: Types["SET_USERS"];
  payload: UsersPayload;
}
export interface UserAction {
  type: Types["SET_USER"];
  payload: UserPayload;
}
export interface ProfileAction {
  type: Types["SET_PROFILE"];
  payload: ProfilePayload;
}
export interface UserStatusAction {
  type:
    | Types["SET_IS_PROFILE"]
    | Types["SET_IS_CHANGE_PROFILE"]
    | Types["SET_IS_CHANGE_PROFILE_PHOTO"]
    | Types["SET_IS_CHANGE_PROFILE_PASSWORD"];
  payload: StatusPayload;
}

export function setUsersActionCreator(users: User[]): UsersAction {
  return { type: ActionType.SET_USERS, payload: { users } };
}

export function setUserActionCreator(user: User | null): UserAction {
  return { type: ActionType.SET_USER, payload: { user } };
}

export function setProfileActionCreator(profile: User | null): ProfileAction {
  return { type: ActionType.SET_PROFILE, payload: { profile } };
}

export function setIsProfileActionCreator(status: boolean): UserStatusAction {
  return { type: ActionType.SET_IS_PROFILE, payload: { status } };
}

export function setIsChangeProfileActionCreator(status: boolean): UserStatusAction {
  return { type: ActionType.SET_IS_CHANGE_PROFILE, payload: { status } };
}

export function setIsChangeProfilePhotoActionCreator(status: boolean): UserStatusAction {
  return { type: ActionType.SET_IS_CHANGE_PROFILE_PHOTO, payload: { status } };
}

export function setIsChangeProfilePasswordActionCreator(status: boolean): UserStatusAction {
  return { type: ActionType.SET_IS_CHANGE_PROFILE_PASSWORD, payload: { status } };
}

export function asyncSetUsers() {
  return async (dispatch: AppDispatch): Promise<boolean> => {
    const result = await userApi.getUsers();

    if (!result.success) {
      showErrorDialog(result.message);
      return false;
    }

    dispatch(setUsersActionCreator(result.data!.users));
    return true;
  };
}

export function asyncSetProfile() {
  return async (dispatch: AppDispatch): Promise<boolean> => {
    dispatch(setIsProfileActionCreator(false));
    const result = await userApi.getMe();

    if (!result.success) {
      dispatch(setProfileActionCreator(null));
      return false;
    }

    dispatch(setProfileActionCreator(result.data!.user));
    dispatch(setIsProfileActionCreator(true));
    return true;
  };
}

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * Memuat profil dengan percobaan ulang. Satu kegagalan sesaat (API lambat,
 * rate limit, jaringan putus-nyambung) tidak boleh langsung dianggap sesi
 * tidak valid. Hanya bila seluruh percobaan gagal, hasilnya false.
 */
export function asyncSetProfileWithRetry(retries = 2, delayMs = 700) {
  return async (dispatch: AppDispatch): Promise<boolean> => {
    for (let attempt = 0; attempt <= retries; attempt++) {
      if (await dispatch(asyncSetProfile())) {
        return true;
      }
      if (attempt < retries) {
        await sleep(delayMs);
      }
    }
    return false;
  };
}

export function asyncSetIsChangeProfile({ name, email }: ChangeProfileValues) {
  return async (dispatch: AppDispatch): Promise<boolean> => {
    dispatch(setIsChangeProfileActionCreator(true));
    const result = await userApi.putMe({ name, email });
    dispatch(setIsChangeProfileActionCreator(false));

    if (!result.success) {
      showErrorDialog(result.message);
      return false;
    }

    await dispatch(asyncSetProfile());
    showSuccessDialog(result.message);
    return true;
  };
}

export function asyncSetIsChangeProfilePhoto(file: File) {
  return async (dispatch: AppDispatch): Promise<boolean> => {
    dispatch(setIsChangeProfilePhotoActionCreator(true));
    const result = await userApi.postMePhoto(file);
    dispatch(setIsChangeProfilePhotoActionCreator(false));

    if (!result.success) {
      showErrorDialog(result.message);
      return false;
    }

    await dispatch(asyncSetProfile());
    showSuccessDialog(result.message);
    return true;
  };
}

export function asyncSetIsChangeProfilePassword({
  password,
  newPassword,
}: ChangePasswordValues) {
  return async (dispatch: AppDispatch): Promise<boolean> => {
    dispatch(setIsChangeProfilePasswordActionCreator(true));
    const result = await userApi.putMePassword({ password, newPassword });
    dispatch(setIsChangeProfilePasswordActionCreator(false));

    if (!result.success) {
      showErrorDialog(result.message);
      return false;
    }

    showSuccessDialog(result.message);
    return true;
  };
}
