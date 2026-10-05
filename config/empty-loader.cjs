/**
 * Loader Turbopack yang mengosongkan modul yang dilewatkan.
 * Dipakai untuk membuang polyfill-module bawaan Next.js (trimStart,
 * Array.prototype.at, Object.hasOwn, dll.): semua fitur itu sudah didukung
 * browser target kita (lihat "browserslist" di package.json), sehingga
 * polyfill-nya hanya menambah JavaScript "legacy" yang tidak terpakai.
 */
module.exports = function emptyLoader() {
  return "";
};
