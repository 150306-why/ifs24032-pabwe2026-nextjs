import { describe, expect, it } from "vitest";
import * as R from "./reducer";
import { ActionType } from "./action";

const post = { id: 1, description: "a" };
const other = { id: 2, description: "b" };

describe("posts reducer", () => {
  it("postsReducer", () => {
    expect(R.postsReducer()).toEqual([]);
    expect(R.postsReducer([post], { type: "X" })).toEqual([post]);
    expect(R.postsReducer([], { type: ActionType.SET_POSTS, payload: { posts: [other] } })).toEqual([other]);
  });

  it("postReducer", () => {
    expect(R.postReducer()).toBeNull();
    expect(R.postReducer(post, { type: "X" })).toEqual(post);
    expect(R.postReducer(null, { type: ActionType.SET_POST, payload: { post: other } })).toEqual(other);
  });

  it.each([
    ["isPost", R.isPostReducer, ActionType.SET_IS_POST],
    ["isPostAdd", R.isPostAddReducer, ActionType.SET_IS_POST_ADD],
    ["isPostAdded", R.isPostAddedReducer, ActionType.SET_IS_POST_ADDED],
    ["isPostChange", R.isPostChangeReducer, ActionType.SET_IS_POST_CHANGE],
    ["isPostChanged", R.isPostChangedReducer, ActionType.SET_IS_POST_CHANGED],
    ["isPostChangeCover", R.isPostChangeCoverReducer, ActionType.SET_IS_POST_CHANGE_COVER],
    ["isPostChangedCover", R.isPostChangedCoverReducer, ActionType.SET_IS_POST_CHANGED_COVER],
    ["isPostDelete", R.isPostDeleteReducer, ActionType.SET_IS_POST_DELETE],
    ["isPostDeleted", R.isPostDeletedReducer, ActionType.SET_IS_POST_DELETED],
    ["isPostLike", R.isPostLikeReducer, ActionType.SET_IS_POST_LIKE],
    ["isPostLiked", R.isPostLikedReducer, ActionType.SET_IS_POST_LIKED],
    ["isPostAddComment", R.isPostAddCommentReducer, ActionType.SET_IS_POST_ADD_COMMENT],
    ["isPostAddedComment", R.isPostAddedCommentReducer, ActionType.SET_IS_POST_ADDED_COMMENT],
    ["isPostDeleteComment", R.isPostDeleteCommentReducer, ActionType.SET_IS_POST_DELETE_COMMENT],
    ["isPostDeletedComment", R.isPostDeletedCommentReducer, ActionType.SET_IS_POST_DELETED_COMMENT],
    ["isPostDeleteAll", R.isPostDeleteAllReducer, ActionType.SET_IS_POST_DELETE_ALL],
    ["isPostDeletedAll", R.isPostDeletedAllReducer, ActionType.SET_IS_POST_DELETED_ALL],
  ])("%s", (_n, reducer, type) => {
    expect(reducer()).toBe(false);
    expect(reducer(false, { type: "X" })).toBe(false);
    expect(reducer(false, { type, payload: { status: true } })).toBe(true);
  });
});
