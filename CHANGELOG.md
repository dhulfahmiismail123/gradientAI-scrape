# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-11-07

### Added
- Dukungan streaming respons real-time via EventEmitter (`stream: true` di options).
- Riwayat pesan (historyMessages) sebagai array object `{ role: "user" | "assistant", content: string }` untuk konteks percakapan.
- Export library sebagai object dengan properti `ask` (fungsi utama) dan `ev` (EventEmitter instance) untuk handling event global.
- Section "Event Handling" di README dengan contoh dengar event `"response"`.
- Detail preset model lengkap di README (untuk GPT OSS 120B dan Qwen3 235B).
- Contoh penggunaan dasar (non-streaming), streaming, dan dengan riwayat pesan.
- Validasi opsi dengan tabel yang lebih detail (termasuk validasi nilai).

### Changed
- Fungsi utama dari `gradientAI(message, options?)` menjadi `gradientAI.ask(messages, options?)`, di mana `messages` adalah object `{ message: string, historyMessages?: array }`.
- Default model dari `"Qwen3 235B"` menjadi `"GPT OSS 120B"`.
- Default options tambah `stream: false`.
- Contoh kode di README: Semua contoh sekarang menggunakan event listener (`gradientAI.ev.on("response", ...)`) untuk handle respons, bukan await langsung.
- Deskripsi library: Lebih fokus pada `ask`, streaming, riwayat, dan EventEmitter.
- Instalasi: Ubah comment dari `// npm` menjadi `# npm` untuk konsistensi Markdown.
- Opsi Impit: Hardcoded di kode, tapi disebutkan sebagai "Opsi Impit (Hardcoded Saat Ini)" di README (hilangkan custom impitOptions di contoh).

### Breaking Changes
- API berubah secara signifikan: Library sekarang export object (`gradientAI.ask` dan `gradientAI.ev`), bukan function langsung. Penggunaan lama `import gradientAI from 'gradientAI-scrape'; const response = await gradientAI("message");` tidak lagi kompatibel—harus migrasi ke event-based atau set `stream: false` untuk respons lengkap.
- Parameter fungsi: Dari single string `message` menjadi object `messages` dengan `message` dan opsional `historyMessages`.
- Respons: Tidak lagi return Promise<string> langsung; gunakan event `"response"` untuk data (e.g., `{ success: true, message: string }` untuk non-streaming).
- Migrasi contoh:
  - **Lama (v0.0.1)**: `await gradientAI("1 tambah 1 berapa?");`
  - **Baru (v1.0.0)**: `gradientAI.ev.on("response", (data) => console.log(data.message)); await gradientAI.ask({ message: "1 tambah 1 berapa?" });`

### Deprecated
- Opsi custom `impitOptions` (seperti `proxyUrl`, `ignoreTlsErrors`) di README—sekarang hardcoded (`browser: "chrome"`, `timeout: 9999999`), tapi bisa di-modifikasi di sumber kode.

## [0.0.1] - 2025-11-01

### Added
- Library dasar untuk interaksi dengan Gradient AI API menggunakan Impit sebagai HTTP client.
- Fungsi utama `gradientAI` yang mengirim pesan dan return respons teks penuh.
- Preset model: `"Qwen3 235B"` (default) dan `"GPT OSS 120B"`.
- Opsi konfigurasi: `gradientAIOptions` (model, clusterMode, enableThinking) dan `impitOptions` (browser, proxy, dll.).
- Contoh penggunaan default dan custom di README.
- Tabel kompatibilitas OS/architecture.
- Instalasi via npm/pnpm dari GitHub repo.
- Section Kontribusi dan Lisensi.

### Dependencies
- `impit ^0.6.1` (HTTP client dengan browser impersonation).

[1.0.0]: https://github.com/dhulfahmiismail123/gradientAI-scrape/compare/v0.0.1...v1.0.0  
[0.0.1]: https://github.com/dhulfahmiismail123/gradientAI-scrape/releases/tag/v0.0.1