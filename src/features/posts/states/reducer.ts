import { ActionType } from "./action";
import { noAction } from "@/types/action";
import type { BaseAction, PostPayload, PostsPayload, StatusPayload } from "@/types/action";
import type { Post } from "@/types";

export function postsReducer(posts: Post[] = [], action: BaseAction = noAction): Post[] {
  if (action.type === ActionType.SET_POSTS) {
    return (action.payload as PostsPayload).posts;
  }
  return posts;
}

export function postReducer(post: Post | null = null, action: BaseAction = noAction): Post | null {
  if (action.type === ActionType.SET_POST) {
    return (action.payload as PostPayload).post;
  }
  return post;
}

function createStatusReducer(actionType: string) {
  return (status = false, action: BaseAction = noAction): boolean =>
    action.type === actionType
      ? (action.payload as StatusPayload).status
      : status;
}

export const isPostReducer = createStatusReducer(ActionType.SET_IS_POST);
export const isPostAddReducer = createStatusReducer(ActionType.SET_IS_POST_ADD);
export const isPostAddedReducer = createStatusReducer(ActionType.SET_IS_POST_ADDED);
export const isPostChangeReducer = createStatusReducer(ActionType.SET_IS_POST_CHANGE);
export const isPostChangedReducer = createStatusReducer(ActionType.SET_IS_POST_CHANGED);
export const isPostChangeCoverReducer = createStatusReducer(ActionType.SET_IS_POST_CHANGE_COVER);
export const isPostChangedCoverReducer = createStatusReducer(ActionType.SET_IS_POST_CHANGED_COVER);
export const isPostDeleteReducer = createStatusReducer(ActionType.SET_IS_POST_DELETE);
export const isPostDeletedReducer = createStatusReducer(ActionType.SET_IS_POST_DELETED);
export const isPostLikeReducer = createStatusReducer(ActionType.SET_IS_POST_LIKE);
export const isPostLikedReducer = createStatusReducer(ActionType.SET_IS_POST_LIKED);
export const isPostAddCommentReducer = createStatusReducer(ActionType.SET_IS_POST_ADD_COMMENT);
export const isPostAddedCommentReducer = createStatusReducer(ActionType.SET_IS_POST_ADDED_COMMENT);
export const isPostDeleteCommentReducer = createStatusReducer(ActionType.SET_IS_POST_DELETE_COMMENT);
export const isPostDeletedCommentReducer = createStatusReducer(ActionType.SET_IS_POST_DELETED_COMMENT);
export const isPostDeleteAllReducer = createStatusReducer(ActionType.SET_IS_POST_DELETE_ALL);
export const isPostDeletedAllReducer = createStatusReducer(ActionType.SET_IS_POST_DELETED_ALL);
