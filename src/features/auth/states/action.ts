import authApi from "../api/authApi";
import { putAccessToken, removeAccessToken } from "@/helpers/apiHelper";
import { showErrorDialog, showSuccessDialog } from "@/helpers/toolsHelper";
import {
  setIsProfileActionCreator,
  setProfileActionCreator,
} from "@/features/users/states/action";
import type { AppDispatch } from "@/store";
import type { LoginValues, RegisterValues, StatusPayload } from "@/types/action";

export const ActionType = {
  SET_IS_AUTH_LOGIN: "SET_IS_AUTH_LOGIN",
  SET_IS_AUTH_REGISTER: "SET_IS_AUTH_REGISTER",
  SET_IS_AUTH_LOGOUT: "SET_IS_AUTH_LOGOUT",
} as const;

export interface StatusAction {
  type: (typeof ActionType)[keyof typeof ActionType];
  payload: StatusPayload;
}

export function setIsAuthLoginActionCreator(status: boolean): StatusAction {
  return { type: ActionType.SET_IS_AUTH_LOGIN, payload: { status } };
}

export function setIsAuthRegisterActionCreator(status: boolean): StatusAction {
  return { type: ActionType.SET_IS_AUTH_REGISTER, payload: { status } };
}

export function setIsAuthLogoutActionCreator(status: boolean): StatusAction {
  return { type: ActionType.SET_IS_AUTH_LOGOUT, payload: { status } };
}

export function asyncSetIsAuthLogin({ email, password }: LoginValues) {
  return async (dispatch: AppDispatch): Promise<boolean> => {
    const result = await authApi.postLogin({ email, password });

    if (!result.success) {
      showErrorDialog(result.message);
      return false;
    }

    putAccessToken(result.data!.token);
    dispatch(setIsAuthLogoutActionCreator(false));
    dispatch(setIsAuthLoginActionCreator(true));
    return true;
  };
}

export function asyncSetIsAuthRegister({ name, email, password }: RegisterValues) {
  return async (dispatch: AppDispatch): Promise<boolean> => {
    const result = await authApi.postRegister({ name, email, password });

    if (!result.success) {
      showErrorDialog(result.message);
      return false;
    }

    dispatch(setIsAuthRegisterActionCreator(true));
    showSuccessDialog(result.message);
    return true;
  };
}

export function asyncSetIsAuthLogout() {
  return (dispatch: AppDispatch): void => {
    removeAccessToken();
    dispatch(setProfileActionCreator(null));
    dispatch(setIsProfileActionCreator(false));
    dispatch(setIsAuthLoginActionCreator(false));
    dispatch(setIsAuthRegisterActionCreator(false));
    dispatch(setIsAuthLogoutActionCreator(true));
  };
}
