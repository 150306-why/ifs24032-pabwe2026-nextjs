import postApi from "../api/postApi";
import {
  showConfirmDialog,
  showErrorDialog,
  showSuccessDialog,
} from "@/helpers/toolsHelper";
import type { AppDispatch } from "@/store";
import type { Post } from "@/types";
import type {
  PostFilter,
  PostFormValues,
  PostPayload,
  PostsPayload,
  StatusPayload,
} from "@/types/action";

export const ActionType = {
  SET_POSTS: "SET_POSTS",
  SET_POST: "SET_POST",
  SET_IS_POST: "SET_IS_POST",
  SET_IS_POST_ADD: "SET_IS_POST_ADD",
  SET_IS_POST_ADDED: "SET_IS_POST_ADDED",
  SET_IS_POST_CHANGE: "SET_IS_POST_CHANGE",
  SET_IS_POST_CHANGED: "SET_IS_POST_CHANGED",
  SET_IS_POST_CHANGE_COVER: "SET_IS_POST_CHANGE_COVER",
  SET_IS_POST_CHANGED_COVER: "SET_IS_POST_CHANGED_COVER",
  SET_IS_POST_DELETE: "SET_IS_POST_DELETE",
  SET_IS_POST_DELETED: "SET_IS_POST_DELETED",
  SET_IS_POST_LIKE: "SET_IS_POST_LIKE",
  SET_IS_POST_LIKED: "SET_IS_POST_LIKED",
  SET_IS_POST_ADD_COMMENT: "SET_IS_POST_ADD_COMMENT",
  SET_IS_POST_ADDED_COMMENT: "SET_IS_POST_ADDED_COMMENT",
  SET_IS_POST_DELETE_COMMENT: "SET_IS_POST_DELETE_COMMENT",
  SET_IS_POST_DELETED_COMMENT: "SET_IS_POST_DELETED_COMMENT",
  SET_IS_POST_DELETE_ALL: "SET_IS_POST_DELETE_ALL",
  SET_IS_POST_DELETED_ALL: "SET_IS_POST_DELETED_ALL",
} as const;

type Types = typeof ActionType;

export interface PostsAction {
  type: Types["SET_POSTS"];
  payload: PostsPayload;
}
export interface PostAction {
  type: Types["SET_POST"];
  payload: PostPayload;
}
export type PostStatusType = Exclude<
  Types[keyof Types],
  Types["SET_POSTS"] | Types["SET_POST"]
>;
export interface PostStatusAction {
  type: PostStatusType;
  payload: StatusPayload;
}

export function setPostsActionCreator(posts: Post[]): PostsAction {
  return { type: ActionType.SET_POSTS, payload: { posts } };
}

export function setPostActionCreator(post: Post | null): PostAction {
  return { type: ActionType.SET_POST, payload: { post } };
}

export function setPostStatusActionCreator(
  type: PostStatusType,
  status: boolean
): PostStatusAction {
  return { type, payload: { status } };
}

const status = setPostStatusActionCreator;

/** Menjalankan mutasi: set flag proses, panggil API, set flag selesai. */
async function runMutation(
  dispatch: AppDispatch,
  flags: { doing: PostStatusType; done: PostStatusType },
  request: () => Promise<{ success: boolean; message: string }>
): Promise<boolean> {
  dispatch(status(flags.done, false));
  dispatch(status(flags.doing, true));
  const result = await request();
  dispatch(status(flags.doing, false));

  if (!result.success) {
    showErrorDialog(result.message);
    return false;
  }

  dispatch(status(flags.done, true));
  showSuccessDialog(result.message);
  return true;
}

export function asyncSetPosts(filter: PostFilter = {}) {
  return async (dispatch: AppDispatch): Promise<boolean> => {
    dispatch(status(ActionType.SET_IS_POST, true));
    const result = await postApi.getPosts(filter);
    dispatch(status(ActionType.SET_IS_POST, false));

    if (!result.success) {
      showErrorDialog(result.message);
      return false;
    }

    dispatch(setPostsActionCreator(result.data!.posts));
    return true;
  };
}

export function asyncSetPost(id: string | number) {
  return async (dispatch: AppDispatch): Promise<boolean> => {
    dispatch(status(ActionType.SET_IS_POST, true));
    const result = await postApi.getPost(id);
    dispatch(status(ActionType.SET_IS_POST, false));

    if (!result.success) {
      dispatch(setPostActionCreator(null));
      showErrorDialog(result.message);
      return false;
    }

    dispatch(setPostActionCreator(result.data!.post));
    return true;
  };
}

export function asyncSetIsPostAdd({ description }: PostFormValues) {
  return (dispatch: AppDispatch) =>
    runMutation(
      dispatch,
      { doing: ActionType.SET_IS_POST_ADD, done: ActionType.SET_IS_POST_ADDED },
      () => postApi.postPost({ description })
    );
}

export function asyncSetIsPostChange(id: string | number, { description }: PostFormValues) {
  return (dispatch: AppDispatch) =>
    runMutation(
      dispatch,
      { doing: ActionType.SET_IS_POST_CHANGE, done: ActionType.SET_IS_POST_CHANGED },
      () => postApi.putPost(id, { description })
    );
}

export function asyncSetIsPostChangeCover(id: string | number, file: File) {
  return (dispatch: AppDispatch) =>
    runMutation(
      dispatch,
      {
        doing: ActionType.SET_IS_POST_CHANGE_COVER,
        done: ActionType.SET_IS_POST_CHANGED_COVER,
      },
      () => postApi.postPostCover(id, file)
    );
}

export function asyncSetIsPostDelete(id: string | number) {
  return async (dispatch: AppDispatch): Promise<boolean> => {
    const confirmed = await showConfirmDialog(
      "Postingan yang dihapus tidak dapat dikembalikan.",
      "Ya, hapus"
    );
    if (!confirmed) {
      return false;
    }

    return runMutation(
      dispatch,
      { doing: ActionType.SET_IS_POST_DELETE, done: ActionType.SET_IS_POST_DELETED },
      () => postApi.deletePost(id)
    );
  };
}

export function asyncSetIsPostLike(id: string | number, liked: boolean) {
  return async (dispatch: AppDispatch): Promise<boolean> => {
    dispatch(status(ActionType.SET_IS_POST_LIKED, false));
    dispatch(status(ActionType.SET_IS_POST_LIKE, true));
    const result = await postApi.postPostLike(id, liked ? "unlike" : "like");
    dispatch(status(ActionType.SET_IS_POST_LIKE, false));

    if (!result.success) {
      showErrorDialog(result.message);
      return false;
    }

    dispatch(status(ActionType.SET_IS_POST_LIKED, true));
    return true;
  };
}

export function asyncSetIsPostAddComment(id: string | number, comment: string) {
  return (dispatch: AppDispatch) =>
    runMutation(
      dispatch,
      {
        doing: ActionType.SET_IS_POST_ADD_COMMENT,
        done: ActionType.SET_IS_POST_ADDED_COMMENT,
      },
      () => postApi.postPostComment(id, comment)
    );
}

export function asyncSetIsPostDeleteComment(id: string | number) {
  return (dispatch: AppDispatch) =>
    runMutation(
      dispatch,
      {
        doing: ActionType.SET_IS_POST_DELETE_COMMENT,
        done: ActionType.SET_IS_POST_DELETED_COMMENT,
      },
      () => postApi.deletePostComment(id)
    );
}

export function asyncSetIsPostDeleteAll() {
  return async (dispatch: AppDispatch): Promise<boolean> => {
    const confirmed = await showConfirmDialog(
      "Seluruh postingan milik Anda akan dihapus permanen.",
      "Ya, hapus semua"
    );
    if (!confirmed) {
      return false;
    }

    return runMutation(
      dispatch,
      {
        doing: ActionType.SET_IS_POST_DELETE_ALL,
        done: ActionType.SET_IS_POST_DELETED_ALL,
      },
      () => postApi.deletePosts()
    );
  };
}
