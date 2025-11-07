# Gradient AI Scrape

## Deskripsi

Library untuk berinteraksi dengan API Gradient AI (chat.gradient.network) menggunakan [Impit](https://www.npmjs.com/package/impit) sebagai HTTP client. Fungsi utama `ask` mengirim pesan ke AI model, mendukung streaming respons, riwayat pesan, dan konfigurasi model preset. Menggunakan EventEmitter untuk menangani event respons, termasuk streaming.

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
   # npm
   npm install https://github.com/dhulfahmiismail123/gradientAI-scrape.git
   
   # pnpm
   pnpm add https://github.com/dhulfahmiismail123/gradientAI-scrape.git
   ```

## Penggunaan

### 1. Penggunaan Dasar

Fungsi `ask` menerima dua parameter utama:
- `messages`: Object berisi `{ message: string, historyMessages?: array }` – Pesan user saat ini dan riwayat opsional.
- `options`: Object konfigurasi model (opsional).

Dengan default, fungsi pakai:
- Model: `"GPT OSS 120B"`
- Cluster Mode: `"hybrid"`
- Enable Thinking: `false`
- Stream: `false`
- Browser Impersonation: `"chrome"`

Respons dikirim via event `"response"` pada EventEmitter internal. Dengarkan event ini untuk menerima data.

**Contoh Dasar (Non-Streaming):**
```javascript
import gradientAI from 'gradientAI-scrape'; // 'events' adalah EventEmitter instance

gradientAI.ev.on("response", (data) => {
  if (data.success) {
    console.log("Respons AI:", data.message);
  } else {
    console.error("Error:", data.message);
  }
});

await gradientAI.ask(
  { message: "1 tambah 1 berapa?" },
  { stream: false }
);
```

**Output Contoh:**
```
{ success: true, message: '1 + 1 = 2', messages: [...] }
```

### 2. Penggunaan dengan Streaming

Aktifkan `stream: true` untuk menerima chunk respons secara real-time via event `"response"`.

**Contoh Streaming:**
```javascript
import gradientAI from 'gradientAI-scrape';

gradientAI.ev.on("response", (data) => {
  if (data.success && data.content) {
    process.stdout.write(data.content); // Tampilkan chunk secara bertahap
  } else if (data.status === "done") {
    console.log("\nSelesai!");
  } else {
    console.error("Error:", data.message);
  }
});

await gradientAI.ask(
  { message: "Ceritakan tentang AI" },
  {
    model: "Qwen3 235B",
    enableThinking: true,
    stream: true
  }
);
```

### 3. Penggunaan dengan Riwayat Pesan

Tambahkan `historyMessages` sebagai array object `{ role: "user" | "assistant", content: string }`.

**Contoh dengan Riwayat:**
```javascript
import gradientAI from 'gradientAI-scrape';

const history = [
  { role: "user", content: "Apa itu AI?" },
  { role: "assistant", content: "AI adalah kecerdasan buatan." }
];

gradientAI.ev.on("response", (data) => {
  if (data.success) {
    console.log("Respons lengkap:", data.message);
    console.log("Riwayat terupdate:", data.messages);
  }
});

await gradientAI.ask(
  { 
    message: "Bagaimana cara kerjanya?", 
    historyMessages: history 
  },
  { stream: false }
);
```

### Opsi Konfigurasi (`options`)

| Parameter | Default Value | Deskripsi | Validasi |
|-----------|---------------|-----------|----------|
| **model** | `"GPT OSS 120B"` | Model AI. | `"GPT OSS 120B"` atau `"Qwen3 235B"` |
| **clusterMode** | Preset-dependent | Mode cluster komputasi. | `"hybrid"`, `"nvidia"` (khusus GPT OSS 120B) |
| **enableThinking** | `false` | Aktifkan mode reasoning/thinking AI. | `true` atau `false` |
| **stream** | `false` | Streaming respons via event. | `true` atau `false` |

**Preset Model Lengkap:**
- **GPT OSS 120B**: `clusterMode: ["hybrid", "nvidia"]`, `enableThinking: [false, true]`, `stream: [false, true]`
- **Qwen3 235B**: `clusterMode: ["hybrid"]`, `enableThinking: [false, true]`, `stream: [false, true]`

## Event Handling

Library menggunakan internal `EventEmitter` (ekspor sebagai `events`). Event `"response"` memicu dengan data:
- Streaming: `{ success: true, content: string }` atau `{ status: "done" }`
- Non-Streaming: `{ success: true, message: string, messages: array }`
- Error: `{ success: false, status: string, message: string }`

**Contoh Dengar Event Global:**
```javascript
import gradientAI from 'gradientAI-scrape';

gradientAI.ev.on("response", (data) => {
  console.log(data);
});
```

## Kontribusi

Fork repo, buat PR, atau buka issue untuk bug/fitur baru (misalnya, dukungan proxy dinamis).

## Lisensi

MIT License. Lihat [LICENSE](LICENSE) untuk detail.

---

Dibuat dengan ❤️ untuk kemudahan akses AI. Pertanyaan? Buka issue!