import { apiFetch } from "@/helpers/apiHelper";
import type { Post } from "@/types";
import type { PostFilter, PostFormValues } from "@/types/action";

/**
 * Catatan: bentuk body untuk like dan hapus komentar mengikuti konvensi
 * API Delcom. Sesuaikan di sini bila dokumentasi resmi berbeda.
 */
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
      body: { description },
    });
  },

  putPost(id: string | number, { description }: PostFormValues) {
    return apiFetch(`/posts/${id}`, {
      method: "PUT",
      body: { description },
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
      body: { type },
    });
  },

  postPostComment(id: string | number, comment: string) {
    return apiFetch(`/posts/${id}/comments`, {
      method: "POST",
      body: { comment },
    });
  },

  deletePostComment(id: string | number, commentId: string | number) {
    return apiFetch(`/posts/${id}/comments`, {
      method: "DELETE",
      body: { comment_id: commentId },
    });
  },

  deletePosts() {
    return apiFetch("/posts", { method: "DELETE" });
  },
};

export default postApi;
