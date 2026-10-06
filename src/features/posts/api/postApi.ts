import { apiFetch } from "@/helpers/apiHelper";
import type { Post } from "@/types";
import type { PostFilter, PostFormValues } from "@/types/action";

/** Bentuk request mengikuti https://open-api.delcom.org/docs/1.0/api-posts */
const postApi = {
  /** filter: { is_me: 1 } untuk postingan milik sendiri */
  getPosts(filter: PostFilter = {}) {
    return apiFetch<{ posts: Post[] }>("/posts", { params: filter });
  },

  getPost(id: string | number) {
    return apiFetch<{ post: Post }>(`/posts/${id}`);
  },

  postPost({ description }: PostFormValues) {
    return apiFetch<{ post_id: string | number }>("/posts", {
      method: "POST",
      json: { description },
    });
  },

  putPost(id: string | number, { description }: PostFormValues) {
    return apiFetch(`/posts/${id}`, {
      method: "PUT",
      json: { description },
    });
  },

  postPostCover(id: string | number, file: File) {
    const formData = new FormData();
    formData.append("cover", file);
    return apiFetch(`/posts/${id}/cover`, { method: "POST", formData });
  },

  deletePost(id: string | number) {
    return apiFetch(`/posts/${id}`, { method: "DELETE" });
  },

  /** type: "like" memberi suka, "unlike" membatalkan */
  postPostLike(id: string | number, type: "like" | "unlike") {
    return apiFetch(`/posts/${id}/likes`, {
      method: "POST",
      json: { like: type === "like" ? 1 : 0 },
    });
  },

  postPostComment(id: string | number, comment: string) {
    return apiFetch(`/posts/${id}/comments`, {
      method: "POST",
      json: { comment },
    });
  },

  /** Menghapus komentar milik pengguna yang sedang login pada postingan ini. */
  deletePostComment(id: string | number) {
    return apiFetch(`/posts/${id}/comments`, { method: "DELETE" });
  },

  deletePosts() {
    return apiFetch("/posts", { method: "DELETE" });
  },
};

export default postApi;
