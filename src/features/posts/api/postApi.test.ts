import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/helpers/apiHelper", () => ({
  apiFetch: vi.fn().mockResolvedValue({ success: true }),
}));

import { apiFetch } from "@/helpers/apiHelper";
import postApi from "./postApi";

const mocked = vi.mocked(apiFetch);

describe("postApi", () => {
  beforeEach(() => mocked.mockClear());

  it("getPosts tanpa dan dengan filter", async () => {
    await postApi.getPosts();
    expect(mocked).toHaveBeenLastCalledWith("/posts", { params: {} });
    await postApi.getPosts({ is_me: 1 });
    expect(mocked).toHaveBeenLastCalledWith("/posts", { params: { is_me: 1 } });
  });

  it("getPost", async () => {
    await postApi.getPost(5);
    expect(mocked).toHaveBeenCalledWith("/posts/5");
  });

  it("postPost", async () => {
    await postApi.postPost({ description: "halo" });
    expect(mocked).toHaveBeenCalledWith("/posts", {
      method: "POST",
      json: { description: "halo" },
    });
  });

  it("putPost", async () => {
    await postApi.putPost(2, { description: "baru" });
    expect(mocked).toHaveBeenCalledWith("/posts/2", {
      method: "PUT",
      json: { description: "baru" },
    });
  });

  it("postPostCover", async () => {
    const file = new File(["x"], "a.png", { type: "image/png" });
    await postApi.postPostCover(3, file);
    const [path, options] = mocked.mock.calls[0];
    expect(path).toBe("/posts/3/cover");
    expect(options?.formData?.get("cover")).toBe(file);
  });

  it("deletePost", async () => {
    await postApi.deletePost(9);
    expect(mocked).toHaveBeenCalledWith("/posts/9", { method: "DELETE" });
  });

  it("postPostLike like & unlike", async () => {
    await postApi.postPostLike(1, "like");
    expect(mocked).toHaveBeenLastCalledWith("/posts/1/likes", {
      method: "POST",
      json: { like: 1 },
    });
    await postApi.postPostLike(1, "unlike");
    expect(mocked.mock.lastCall?.[1]?.json).toEqual({ like: 0 });
  });

  it("postPostComment", async () => {
    await postApi.postPostComment(1, "bagus");
    expect(mocked).toHaveBeenCalledWith("/posts/1/comments", {
      method: "POST",
      json: { comment: "bagus" },
    });
  });

  it("deletePostComment", async () => {
    await postApi.deletePostComment(1);
    expect(mocked).toHaveBeenCalledWith("/posts/1/comments", { method: "DELETE" });
  });

  it("deletePosts", async () => {
    await postApi.deletePosts();
    expect(mocked).toHaveBeenCalledWith("/posts", { method: "DELETE" });
  });
});
