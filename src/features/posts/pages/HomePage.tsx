"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { IconHeart, IconMessageCircle, IconPlus, IconSearch, IconTrash } from "@tabler/icons-react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { asyncSetIsPostDeleteAll, asyncSetPosts } from "../states/action";
import { formatDate } from "@/helpers/toolsHelper";
import AddModal from "../modals/AddModal";

export default function HomePage() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const posts = useAppSelector((state) => state.posts);
  const isLoading = useAppSelector((state) => state.isPost);
  const [keyword, setKeyword] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const onlyMe = searchParams.get("filter") === "me";

  const load = useCallback(() => {
    dispatch(asyncSetPosts({ is_me: onlyMe ? 1 : "" }));
  }, [dispatch, onlyMe]);

  useEffect(() => {
    load();
  }, [load]);

  const visible = useMemo(() => {
    const key = keyword.trim().toLowerCase();
    if (!key) return posts;
    return posts.filter(
      (post) =>
        post.description.toLowerCase().includes(key) ||
        (post.author ? post.author.name.toLowerCase().includes(key) : false)
    );
  }, [posts, keyword]);

  async function handleDeleteAll() {
    const ok = await dispatch(asyncSetIsPostDeleteAll());
    if (ok) {
      load();
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">
          {onlyMe ? "Postingan Saya" : "Semua Postingan"}
        </h1>
        <div className="flex gap-2">
          {onlyMe && (
            <button
              type="button"
              onClick={handleDeleteAll}
              className="flex items-center gap-2 rounded-lg border border-red-300 px-4 py-2 font-semibold text-red-600 hover:bg-red-50"
            >
              <IconTrash size={18} /> Hapus Semua
            </button>
          )}
          <button
            type="button"
            onClick={() => setAddOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 font-semibold text-white hover:bg-sky-700"
          >
            <IconPlus size={18} /> Tambah Postingan
          </button>
        </div>
      </div>

      <div className="flex gap-2 border-b border-slate-200">
        <Link
          href="/"
          className={`border-b-2 px-4 py-2 text-sm font-semibold ${
            onlyMe ? "border-transparent text-slate-500" : "border-sky-600 text-sky-700"
          }`}
        >
          Linimasa
        </Link>
        <Link
          href="/?filter=me"
          className={`border-b-2 px-4 py-2 text-sm font-semibold ${
            onlyMe ? "border-sky-600 text-sky-700" : "border-transparent text-slate-500"
          }`}
        >
          Postingan Saya
        </Link>
      </div>

      <div className="relative">
        <IconSearch size={16} className="absolute left-3 top-3 text-slate-400" />
        <input
          aria-label="Cari postingan"
          placeholder="Cari deskripsi atau nama pembuat..."
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3"
        />
      </div>

      {isLoading ? (
        <p className="text-slate-500">Memuat data...</p>
      ) : visible.length === 0 ? (
        <p className="text-slate-500">Tidak ada postingan.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((post) => (
            <Link
              key={post.id}
              href={`/posts/${post.id}`}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:shadow-md"
            >
              {post.cover && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={post.cover}
                  alt="Cover postingan"
                  className="h-40 w-full object-cover"
                />
              )}
              <div className="space-y-2 p-4">
                <p className="text-sm font-semibold">
                  {post.author ? post.author.name : "Anonim"}
                </p>
                <p className="line-clamp-3 text-slate-700">{post.description}</p>
                <p className="text-xs text-slate-400">{formatDate(post.created_at)}</p>
                <div className="flex gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <IconHeart size={16} data-testid="icon-likes" />
                    {post.likes ? post.likes.length : 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <IconMessageCircle size={16} />
                    {post.comments ? post.comments.length : 0}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <AddModal open={addOpen} onClose={() => setAddOpen(false)} onSuccess={load} />
    </div>
  );
}
