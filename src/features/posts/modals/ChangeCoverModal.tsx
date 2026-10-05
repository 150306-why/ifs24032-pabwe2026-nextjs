"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { IconX } from "@tabler/icons-react";
import { useAppDispatch } from "@/hooks/redux";
import { asyncSetIsPostChangeCover } from "../states/action";
import { showWarningDialog } from "@/helpers/toolsHelper";

interface Props {
  open: boolean;
  postId: string | number;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ChangeCoverModal({ open, postId, onClose, onSuccess }: Props) {
  const dispatch = useAppDispatch();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0];
    if (!selected) {
      setFile(null);
      setPreview(null);
      return;
    }
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!file) {
      showWarningDialog("Pilih gambar terlebih dahulu.");
      return;
    }

    setLoading(true);
    const ok = await dispatch(asyncSetIsPostChangeCover(postId, file));
    setLoading(false);

    if (ok) {
      setFile(null);
      setPreview(null);
      onClose();
      onSuccess?.();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <form
        onSubmit={handleSubmit}
        role="dialog"
        aria-label="Ubah Cover"
        className="w-full max-w-md space-y-4 rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">Ubah Cover</h3>
          <button type="button" aria-label="Tutup" onClick={onClose}>
            <IconX size={20} />
          </button>
        </div>
        {preview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt="Pratinjau cover"
            className="max-h-60 w-full rounded-lg object-cover"
          />
        )}
        <div>
          <label htmlFor="cover-file" className="mb-1 block text-sm font-medium">
            Gambar Cover
          </label>
          <input
            id="cover-file"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-sky-600 py-2.5 font-semibold text-white hover:bg-sky-700 disabled:opacity-60"
        >
          {loading ? "Mengunggah..." : "Unggah"}
        </button>
      </form>
    </div>
  );
}
