"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { IconX } from "@tabler/icons-react";
import { useAppDispatch } from "@/hooks/redux";
import useInput from "@/hooks/useInput";
import { asyncSetIsPostChange } from "../states/action";
import { showWarningDialog } from "@/helpers/toolsHelper";
import type { Post } from "@/types";

interface Props {
  open: boolean;
  post: Post | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ChangeModal({ open, post, onClose, onSuccess }: Props) {
  const dispatch = useAppDispatch();
  const [description, onDescriptionChange] = useInput(post ? post.description : "");
  const [loading, setLoading] = useState(false);

  if (!open || !post) return null;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!description.trim()) {
      showWarningDialog("Deskripsi postingan wajib diisi.");
      return;
    }

    setLoading(true);
    const ok = await dispatch(asyncSetIsPostChange(post!.id, { description }));
    setLoading(false);

    if (ok) {
      onClose();
      onSuccess?.();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <form
        onSubmit={handleSubmit}
        role="dialog"
        aria-label="Ubah Postingan"
        className="w-full max-w-md space-y-4 rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">Ubah Postingan</h3>
          <button type="button" aria-label="Tutup" onClick={onClose}>
            <IconX size={20} />
          </button>
        </div>
        <div>
          <label htmlFor="change-description" className="mb-1 block text-sm font-medium">
            Deskripsi
          </label>
          <textarea
            id="change-description"
            rows={4}
            value={description}
            onChange={onDescriptionChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-sky-600 py-2.5 font-semibold text-white hover:bg-sky-700 disabled:opacity-60"
        >
          {loading ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </form>
    </div>
  );
}
