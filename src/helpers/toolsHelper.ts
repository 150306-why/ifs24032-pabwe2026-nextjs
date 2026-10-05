import type { SweetAlertOptions } from "sweetalert2";

/**
 * SweetAlert2 dimuat secara lazy: hanya diunduh saat dialog pertama kali
 * ditampilkan, sehingga tidak membebani JavaScript awal halaman.
 */
async function fire(options: SweetAlertOptions) {
  const { default: Swal } = await import("sweetalert2");
  return Swal.fire(options);
}

export function showSuccessDialog(message: string) {
  return fire({
    icon: "success",
    title: "Berhasil",
    text: message,
    confirmButtonColor: "#0ea5e9",
  });
}

export function showErrorDialog(message: string) {
  return fire({
    icon: "error",
    title: "Gagal",
    text: message,
    confirmButtonColor: "#0ea5e9",
  });
}

export function showWarningDialog(message: string) {
  return fire({
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
  const result = await fire({
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
