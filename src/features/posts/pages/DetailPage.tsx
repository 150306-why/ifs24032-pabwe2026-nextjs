"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { IconEdit, IconHeart, IconHeartFilled, IconPhoto, IconTrash } from "@tabler/icons-react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  asyncSetIsPostAddComment,
  asyncSetIsPostDelete,
  asyncSetIsPostDeleteComment,
  asyncSetIsPostLike,
  asyncSetPost,
} from "../states/action";
import { formatDate, showWarningDialog } from "@/helpers/toolsHelper";
import ChangeModal from "../modals/ChangeModal";
import ChangeCoverModal from "../modals/ChangeCoverModal";

export default function DetailPage() {
  const { postId } = useParams<{ postId: string }>();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const post = useAppSelector((state) => state.post);
  const profile = useAppSelector((state) => state.profile);
  const isLoading = useAppSelector((state) => state.isPost);
  const [comment, setComment] = useState("");
  const [changeOpen, setChangeOpen] = useState(false);
  const [coverOpen, setCoverOpen] = useState(false);

  useEffect(() => {
    dispatch(asyncSetPost(postId));
  }, [dispatch, postId]);

  function reload() {
    dispatch(asyncSetPost(postId));
  }

  const isOwner =
    post !== null && profile !== null && String(post.user_id ?? post.author?.id) === String(profile.id);
  const likes = post && post.likes ? post.likes : [];
  const comments = post && post.comments ? post.comments : [];
  const liked = profile !== null && likes.some((like) => String(like.user_id) === String(profile.id));

  async function handleLike() {
    const ok = await dispatch(asyncSetIsPostLike(postId, liked));
    if (ok) reload();
  }

  async function handleComment(event: FormEvent) {
    event.preventDefault();

    if (!comment.trim()) {
      showWarningDialog("Komentar tidak boleh kosong.");
      return;
    }

    const ok = await dispatch(asyncSetIsPostAddComment(postId, comment));
    if (ok) {
      setComment("");
      reload();
    }
  }

  async function handleDeleteComment(commentId: string | number) {
    const ok = await dispatch(asyncSetIsPostDeleteComment(postId, commentId));
    if (ok) reload();
  }

  async function handleDelete() {
    const ok = await dispatch(asyncSetIsPostDelete(postId));
    if (ok) {
      router.push("/");
    }
  }

  if (isLoading) {
    return <p className="text-slate-600">Memuat data...</p>;
  }

  if (!post) {
    return (
      <div className="space-y-3">
        <p className="text-slate-600">Postingan tidak ditemukan.</p>
        <Link prefetch={false} href="/" className="font-semibold text-sky-700">
          Kembali ke beranda
        </Link>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-3xl space-y-5 rounded-2xl border border-slate-200 bg-white p-6">
      <h1 className="sr-only">Detail Postingan</h1>
      {post.cover && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.cover}
          alt="Cover postingan"
          className="max-h-96 w-full rounded-xl bg-slate-100 object-contain"
        />
      )}

      <div className="flex items-center gap-3">
        {post.author && post.author.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.author.photo}
            alt={post.author.name}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-700 font-bold text-white">
            {post.author ? post.author.name.charAt(0).toUpperCase() : "?"}
          </span>
        )}
        <div>
          <p className="font-semibold">{post.author ? post.author.name : "Anonim"}</p>
          <p className="text-xs text-slate-600">{formatDate(post.created_at)}</p>
        </div>
      </div>

      <p className="whitespace-pre-line text-slate-700">{post.description}</p>

      <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={handleLike}
          aria-pressed={liked}
          className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-50"
        >
          {liked ? <IconHeartFilled size={16} className="text-red-500" /> : <IconHeart size={16} />}
          {liked ? "Batal Suka" : "Suka"} ({likes.length})
        </button>

        {isOwner && (
          <>
            <button
              type="button"
              onClick={() => setCoverOpen(true)}
              className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-50"
            >
              <IconPhoto size={16} /> Ubah Cover
            </button>
            <button
              type="button"
              onClick={() => setChangeOpen(true)}
              className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-50"
            >
              <IconEdit size={16} /> Ubah Postingan
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              <IconTrash size={16} /> Hapus Postingan
            </button>
          </>
        )}
      </div>

      <section className="space-y-3">
        <h2 className="font-semibold">Komentar ({comments.length})</h2>
        <form onSubmit={handleComment} className="flex gap-2">
          <input
            aria-label="Tulis komentar"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Tulis komentar..."
            className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2"
          />
          <button
            type="submit"
            className="rounded-lg bg-sky-700 px-4 py-2 font-semibold text-white hover:bg-sky-800"
          >
            Kirim
          </button>
        </form>

        {comments.length === 0 ? (
          <p className="text-sm text-slate-600">Belum ada komentar.</p>
        ) : (
          <ul className="space-y-2">
            {comments.map((item) => (
              <li
                key={item.id}
                className="flex items-start justify-between gap-3 rounded-lg bg-slate-50 p-3"
              >
                <div>
                  <p className="text-sm font-semibold">{item.user ? item.user.name : "Anonim"}</p>
                  <p className="text-sm text-slate-700">{item.comment}</p>
                  <p className="text-xs text-slate-600">{formatDate(item.created_at)}</p>
                </div>
                {profile !== null && String(item.user_id) === String(profile.id) && (
                  <button
                    type="button"
                    aria-label="Hapus komentar"
                    onClick={() => handleDeleteComment(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <IconTrash size={16} />
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <ChangeModal
        key={`${post.id}-${post.updated_at}`}
        open={changeOpen}
        post={post}
        onClose={() => setChangeOpen(false)}
        onSuccess={reload}
      />
      <ChangeCoverModal
        open={coverOpen}
        postId={post.id}
        onClose={() => setCoverOpen(false)}
        onSuccess={reload}
      />
    </article>
  );
}
