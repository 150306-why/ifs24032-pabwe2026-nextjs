import type { Post, User } from "./index";

export interface StatusPayload {
  status: boolean;
}

export interface UsersPayload {
  users: User[];
}

export interface UserPayload {
  user: User | null;
}

export interface ProfilePayload {
  profile: User | null;
}

export interface PostsPayload {
  posts: Post[];
}

export interface PostPayload {
  post: Post | null;
}

export type PostFilter = {
  is_me?: 1 | "";
};

/** Tipe action dasar yang diterima seluruh reducer. */
export interface BaseAction {
  type: string;
  payload?: unknown;
}

export const noAction: BaseAction = { type: "" };

export interface PostFormValues {
  description: string;
}

export interface LoginValues {
  email: string;
  password: string;
}

export interface RegisterValues extends LoginValues {
  name: string;
}

export interface ChangeProfileValues {
  name: string;
  email: string;
}

export interface ChangePasswordValues {
  password: string;
  newPassword: string;
}
