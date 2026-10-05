import { ActionType } from "./action";
import { noAction } from "@/types/action";
import type { BaseAction, StatusPayload } from "@/types/action";

function createStatusReducer(actionType: string) {
  return (status = false, action: BaseAction = noAction): boolean =>
    action.type === actionType
      ? (action.payload as StatusPayload).status
      : status;
}

export const isAuthLoginReducer = createStatusReducer(ActionType.SET_IS_AUTH_LOGIN);
export const isAuthRegisterReducer = createStatusReducer(ActionType.SET_IS_AUTH_REGISTER);
export const isAuthLogoutReducer = createStatusReducer(ActionType.SET_IS_AUTH_LOGOUT);
