# Gradient AI Scrape

## Deskripsi

Library untuk berinteraksi dengan API Gradient AI (chat.gradient.network) menggunakan [Impit](https://www.npmjs.com/package/impit) sebagai HTTP client. Fungsi utama `gradientAI` mengirim pesan ke AI model dan mengembalikan respons teks penuh. Mendukung konfigurasi default untuk kemudahan, serta opsi custom untuk model AI dan impersonasi browser.

## Kompatibilitas

| Operating System | Architecture | libc implementation | Prebuilt binaries available |
|--|--|--|--|
| Linux | x86_64 | glibc | ✅ |
| Linux | x86_64 | musl | ✅ |
| Linux | arm64 | glibc | ✅ |
| Linux | arm64 | musl | ✅ |
| macOS | x86_64 | N/A | ✅ |
| Windows | x86_64 | N/A | ✅ |
| macOS | arm64 | N/A | ✅ |
| Windows | arm64 | N/A | ✅ |

## Instalasi

1. Pastikan Node.js ≥ v18 terinstall.
2. Install dependencies:
   ```bash
   // npm
   npm install https://github.com/dhulfahmiismail123/gradientAI-scrape.git
   
   // pnpm
   pnpm add https://github.com/dhulfahmiismail123/gradientAI-scrape.git
   ```

## Penggunaan

### 1. Penggunaan Default (Tanpa Opsi)

Dengan default, fungsi pakai:
- Model: `"Qwen3 235B"`
- Cluster Mode: `"hybrid"`
- Enable Thinking: `false`
- Browser Impersonation: `"chrome"`

**Contoh:**
```javascript
import gradientAI from 'gradientAI-scrape';

const response = await gradientAI("1 tambah 1 berapa?");
console.log(response);  // Output: "1 + 1 = 2" (atau respons AI serupa)
```

### 2. Penggunaan dengan Opsi Custom

Anda bisa override opsi untuk `gradientAIOptions` (AI config) dan `impitOptions` (HTTP client config).

#### Opsi Gradient AI (`gradientAIOptions`)
- `model` (string): Model AI, e.g., `"Qwen3 235B"` atau `"GPT OSS 120B"`.
- `clusterMode` (string): Mode cluster, e.g., `"hybrid"` atau `"nvidia" (khusus GPT OSS 120B) `.
- `enableThinking` (boolean): Aktifkan mode thinking (default: `false`).

#### Opsi Impit (`impitOptions`)
- `browser` (string): Browser impersonation, e.g., `"chrome"` atau `"firefox"`.
- Opsi lain dari Impit: `proxyUrl` (string), `ignoreTlsErrors` (boolean) – lihat [docs Impit](https://www.npmjs.com/package/impit).

**Contoh Custom:**
```javascript
import gradientAI from 'gradientAI-scrape';

const customResponse = await gradientAI(
  "Ceritakan tentang AI",  // Pesan user
  {
    model: "GPT OSS 120B",     // Custom model
    clusterMode: "nvidia",     // Custom cluster
    enableThinking: true       // Custom thinking
  },
  {
    browser: "firefox",        // Custom browser
    // proxyUrl: "http://proxy:8080",  // Optional proxy
    // ignoreTlsErrors: true           // Optional skip TLS
  }
);
console.log(customResponse);
```

### Opsi Default Lengkap

| Parameter | Default Value | Deskripsi |
|-----------|---------------|-----------|
| **gradientAIOptions.model** | `"Qwen3 235B"` | Model AI utama. |
| **gradientAIOptions.clusterMode** | `"hybrid"` | Mode komputasi cluster. |
| **gradientAIOptions.enableThinking** | `false` | Mode reasoning AI. |
| **impitOptions.browser** | `"chrome"` | Impersonasi browser. |

## Kontribusi

Fork repo, buat PR, atau buka issue untuk bug/fitur baru.

## Lisensi

MIT License. Lihat [LICENSE](LICENSE) untuk detail.

---

Dibuat dengan ❤️ untuk kemudahan akses AI. Pertanyaan? Buka issue!
