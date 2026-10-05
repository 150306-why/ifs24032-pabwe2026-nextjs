import Swal from "sweetalert2";

export function showSuccessDialog(message: string) {
  return Swal.fire({
    icon: "success",
    title: "Berhasil",
    text: message,
    confirmButtonColor: "#0ea5e9",
  });
}

export function showErrorDialog(message: string) {
  return Swal.fire({
    icon: "error",
    title: "Gagal",
    text: message,
    confirmButtonColor: "#0ea5e9",
  });
}

export function showWarningDialog(message: string) {
  return Swal.fire({
    icon: "warning",
    title: "Perhatian",
    text: message,
    confirmButtonColor: "#0ea5e9",
  });
}

export async function showConfirmDialog(
  message: string,
  confirmText = "Ya, lanjutkan"
): Promise<boolean> {
  const result = await Swal.fire({
    icon: "question",
    title: "Konfirmasi",
    text: message,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: "Batal",
    confirmButtonColor: "#0ea5e9",
    cancelButtonColor: "#94a3b8",
  });
  return result.isConfirmed;
}

export function formatDate(value?: string | null): string {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
  });
}
