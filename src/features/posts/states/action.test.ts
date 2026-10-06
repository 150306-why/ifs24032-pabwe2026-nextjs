import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../api/postApi", () => ({
  default: {
    getPosts: vi.fn(), getPost: vi.fn(), postPost: vi.fn(), putPost: vi.fn(),
    postPostCover: vi.fn(), deletePost: vi.fn(), postPostLike: vi.fn(),
    postPostComment: vi.fn(), deletePostComment: vi.fn(), deletePosts: vi.fn(),
  },
}));
vi.mock("@/helpers/toolsHelper", () => ({
  showConfirmDialog: vi.fn(),
  showErrorDialog: vi.fn(),
  showSuccessDialog: vi.fn(),
}));

import api from "../api/postApi";
import { showConfirmDialog, showErrorDialog, showSuccessDialog } from "@/helpers/toolsHelper";
import type { AppDispatch } from "@/store";
import * as A from "./action";

const T = A.ActionType;
const ok = { success: true, message: "ok", data: null };
const fail = { success: false, message: "gagal", data: null };
const dispatchMock = () => vi.fn() as unknown as AppDispatch & ReturnType<typeof vi.fn>;
const st = A.setPostStatusActionCreator;

describe("posts action", () => {
  beforeEach(() => vi.clearAllMocks());

  it("action creators", () => {
    const post = { id: 1, description: "d" };
    expect(A.setPostsActionCreator([post])).toEqual({ type: T.SET_POSTS, payload: { posts: [post] } });
    expect(A.setPostActionCreator(post)).toEqual({ type: T.SET_POST, payload: { post } });
    expect(st(T.SET_IS_POST_LIKE, true)).toEqual({ type: T.SET_IS_POST_LIKE, payload: { status: true } });
  });

  it("asyncSetPosts sukses & gagal", async () => {
    const posts = [{ id: 1, description: "d" }];
    vi.mocked(api.getPosts).mockResolvedValueOnce({ success: true, message: "", data: { posts } });
    let dispatch = dispatchMock();
    expect(await A.asyncSetPosts({ is_me: 1 })(dispatch)).toBe(true);
    expect(api.getPosts).toHaveBeenCalledWith({ is_me: 1 });
    expect(dispatch).toHaveBeenCalledWith(A.setPostsActionCreator(posts));

    vi.mocked(api.getPosts).mockResolvedValueOnce(fail);
    dispatch = dispatchMock();
    expect(await A.asyncSetPosts()(dispatch)).toBe(false);
    expect(api.getPosts).toHaveBeenLastCalledWith({});
    expect(showErrorDialog).toHaveBeenCalledWith("gagal");
  });

  it("asyncSetPost sukses & gagal", async () => {
    const post = { id: 1, description: "d" };
    vi.mocked(api.getPost).mockResolvedValueOnce({ success: true, message: "", data: { post } });
    let dispatch = dispatchMock();
    expect(await A.asyncSetPost(1)(dispatch)).toBe(true);
    expect(dispatch).toHaveBeenCalledWith(A.setPostActionCreator(post));

    vi.mocked(api.getPost).mockResolvedValueOnce(fail);
    dispatch = dispatchMock();
    expect(await A.asyncSetPost(1)(dispatch)).toBe(false);
    expect(dispatch).toHaveBeenCalledWith(A.setPostActionCreator(null));
  });

  it.each([
    ["add", () => A.asyncSetIsPostAdd({ description: "d" }), api.postPost, T.SET_IS_POST_ADD, T.SET_IS_POST_ADDED],
    ["change", () => A.asyncSetIsPostChange(1, { description: "d" }), api.putPost, T.SET_IS_POST_CHANGE, T.SET_IS_POST_CHANGED],
    ["cover", () => A.asyncSetIsPostChangeCover(1, new File(["x"], "a.png")), api.postPostCover, T.SET_IS_POST_CHANGE_COVER, T.SET_IS_POST_CHANGED_COVER],
    ["add comment", () => A.asyncSetIsPostAddComment(1, "c"), api.postPostComment, T.SET_IS_POST_ADD_COMMENT, T.SET_IS_POST_ADDED_COMMENT],
    ["delete comment", () => A.asyncSetIsPostDeleteComment(1), api.deletePostComment, T.SET_IS_POST_DELETE_COMMENT, T.SET_IS_POST_DELETED_COMMENT],
  ])("mutasi %s: sukses & gagal", async (_n, make, apiFn, doing, done) => {
    vi.mocked(apiFn as never as typeof api.postPost).mockResolvedValueOnce(ok);
    let dispatch = dispatchMock();
    expect(await make()(dispatch)).toBe(true);
    expect(dispatch).toHaveBeenCalledWith(st(doing, true));
    expect(dispatch).toHaveBeenCalledWith(st(doing, false));
    expect(dispatch).toHaveBeenCalledWith(st(done, true));
    expect(showSuccessDialog).toHaveBeenCalledWith("ok");

    vi.mocked(apiFn as never as typeof api.postPost).mockResolvedValueOnce(fail);
    dispatch = dispatchMock();
    expect(await make()(dispatch)).toBe(false);
    expect(dispatch).not.toHaveBeenCalledWith(st(done, true));
    expect(showErrorDialog).toHaveBeenCalledWith("gagal");
  });

  it("asyncSetIsPostDelete: batal, sukses, gagal", async () => {
    vi.mocked(showConfirmDialog).mockResolvedValueOnce(false);
    let dispatch = dispatchMock();
    expect(await A.asyncSetIsPostDelete(1)(dispatch)).toBe(false);
    expect(api.deletePost).not.toHaveBeenCalled();

    vi.mocked(showConfirmDialog).mockResolvedValueOnce(true);
    vi.mocked(api.deletePost).mockResolvedValueOnce(ok);
    dispatch = dispatchMock();
    expect(await A.asyncSetIsPostDelete(1)(dispatch)).toBe(true);
    expect(dispatch).toHaveBeenCalledWith(st(T.SET_IS_POST_DELETED, true));

    vi.mocked(showConfirmDialog).mockResolvedValueOnce(true);
    vi.mocked(api.deletePost).mockResolvedValueOnce(fail);
    dispatch = dispatchMock();
    expect(await A.asyncSetIsPostDelete(1)(dispatch)).toBe(false);
  });

  it("asyncSetIsPostDeleteAll: batal, sukses, gagal", async () => {
    vi.mocked(showConfirmDialog).mockResolvedValueOnce(false);
    expect(await A.asyncSetIsPostDeleteAll()(dispatchMock())).toBe(false);
    expect(api.deletePosts).not.toHaveBeenCalled();

    vi.mocked(showConfirmDialog).mockResolvedValueOnce(true);
    vi.mocked(api.deletePosts).mockResolvedValueOnce(ok);
    const dispatch = dispatchMock();
    expect(await A.asyncSetIsPostDeleteAll()(dispatch)).toBe(true);
    expect(dispatch).toHaveBeenCalledWith(st(T.SET_IS_POST_DELETED_ALL, true));

    vi.mocked(showConfirmDialog).mockResolvedValueOnce(true);
    vi.mocked(api.deletePosts).mockResolvedValueOnce(fail);
    expect(await A.asyncSetIsPostDeleteAll()(dispatchMock())).toBe(false);
  });

  it("asyncSetIsPostLike: like, unlike, gagal", async () => {
    vi.mocked(api.postPostLike).mockResolvedValueOnce(ok);
    let dispatch = dispatchMock();
    expect(await A.asyncSetIsPostLike(1, false)(dispatch)).toBe(true);
    expect(api.postPostLike).toHaveBeenLastCalledWith(1, "like");
    expect(dispatch).toHaveBeenCalledWith(st(T.SET_IS_POST_LIKED, true));

    vi.mocked(api.postPostLike).mockResolvedValueOnce(ok);
    await A.asyncSetIsPostLike(1, true)(dispatchMock());
    expect(api.postPostLike).toHaveBeenLastCalledWith(1, "unlike");

    vi.mocked(api.postPostLike).mockResolvedValueOnce(fail);
    dispatch = dispatchMock();
    expect(await A.asyncSetIsPostLike(1, false)(dispatch)).toBe(false);
    expect(showErrorDialog).toHaveBeenCalledWith("gagal");
    expect(dispatch).not.toHaveBeenCalledWith(st(T.SET_IS_POST_LIKED, true));
  });
});
