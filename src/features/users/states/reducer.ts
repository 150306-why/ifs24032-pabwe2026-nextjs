import { ActionType } from "./action";
import { noAction } from "@/types/action";
import type {
  BaseAction,
  ProfilePayload,
  StatusPayload,
  UserPayload,
  UsersPayload,
} from "@/types/action";
import type { User } from "@/types";

export function usersReducer(users: User[] = [], action: BaseAction = noAction): User[] {
  if (action.type === ActionType.SET_USERS) {
    return (action.payload as UsersPayload).users;
  }
  return users;
}

export function userReducer(user: User | null = null, action: BaseAction = noAction): User | null {
  if (action.type === ActionType.SET_USER) {
    return (action.payload as UserPayload).user;
  }
  return user;
}

export function profileReducer(profile: User | null = null, action: BaseAction = noAction): User | null {
  if (action.type === ActionType.SET_PROFILE) {
    return (action.payload as ProfilePayload).profile;
  }
  return profile;
}

function createStatusReducer(actionType: string) {
  return (status = false, action: BaseAction = noAction): boolean =>
    action.type === actionType
      ? (action.payload as StatusPayload).status
      : status;
}

export const isProfileReducer = createStatusReducer(ActionType.SET_IS_PROFILE);
export const isChangeProfileReducer = createStatusReducer(ActionType.SET_IS_CHANGE_PROFILE);
export const isChangeProfilePhotoReducer = createStatusReducer(ActionType.SET_IS_CHANGE_PROFILE_PHOTO);
export const isChangeProfilePasswordReducer = createStatusReducer(ActionType.SET_IS_CHANGE_PROFILE_PASSWORD);
