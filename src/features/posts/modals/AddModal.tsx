"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { IconX } from "@tabler/icons-react";
import { useAppDispatch } from "@/hooks/redux";
import useInput from "@/hooks/useInput";
import { asyncSetIsPostAdd } from "../states/action";
import { showWarningDialog } from "@/helpers/toolsHelper";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddModal({ open, onClose, onSuccess }: Props) {
  const dispatch = useAppDispatch();
  const [description, onDescriptionChange, setDescription] = useInput("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!description.trim()) {
      showWarningDialog("Deskripsi postingan wajib diisi.");
      return;
    }

    setLoading(true);
    const ok = await dispatch(asyncSetIsPostAdd({ description }));
    setLoading(false);

    if (ok) {
      setDescription("");
      onClose();
      onSuccess?.();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <form
        onSubmit={handleSubmit}
        role="dialog"
        aria-label="Tambah Postingan"
        className="w-full max-w-md space-y-4 rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">Tambah Postingan</h3>
          <button type="button" aria-label="Tutup" onClick={onClose}>
            <IconX size={20} />
          </button>
        </div>
        <div>
          <label htmlFor="add-description" className="mb-1 block text-sm font-medium">
            Deskripsi
          </label>
          <textarea
            id="add-description"
            rows={4}
            value={description}
            onChange={onDescriptionChange}
            placeholder="Apa yang ingin Anda bagikan?"
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-sky-600 py-2.5 font-semibold text-white hover:bg-sky-700 disabled:opacity-60"
        >
          {loading ? "Memublikasikan..." : "Publikasikan"}
        </button>
      </form>
    </div>
  );
}
