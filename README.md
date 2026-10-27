# Caption Maker AI Studio — Apple HIG Copywriting & Analytics Engine (v2.0)

Aplikasi web copywriting media sosial berkonversi tinggi dengan standar desain **Apple Human Interface Guidelines (HIG)** dan estetika visual terinspirasi dari antarmuka **captions.ai**.

---

## 🚀 Fitur Baru yang Telah Diimplementasikan (v2.0)

### 1. Dual Engine Processing: Smart Neural vs. Google Gemini AI Live
- **Smart Neural Engine (Offline):** Bekerja seketika tanpa kuota, tanpa internet, dan tanpa API Key.
- **Google Gemini AI (Cloud Live):** Hubungkan langsung kunci API Google Gemini (`AIzaSy...`) melalui modal **Pengaturan (Apple HIG Sheet)** untuk variasi narasi tanpa batas. Kunci API disimpan aman di `LocalStorage` browser Anda.

### 2. 6 Pilihan Persona & Tone of Voice
- 💼 **Kasual / Bisnis**: Hangat, persuasif, solutif, mudah dipahami.
- 🌿 **Psikolog / Ruang Kalem**: Empatis, mindful, menenangkan, bebas penghakiman.
- 👔 **Profesional Korporat**: Data-driven, tajam, kredibel, berwibawa.
- ⚡ **Kreatif / Gen-Z**: Punchy, relatable, cepat, selaras tren video vertikal.
- 🎓 **Edukator & Mentor**: Terstruktur, langkah demi langkah, mudah dipraktikkan.
- 🛒 **Direct Promo & Launch**: Tinggi urgensi, FOMO, penawaran terbatas.

### 3. Penggeser Karakter Emosional (Tone Sliders)
- **Tingkat Kehangatan (Emotional Warmth):** Formal/Dingin ⟷ Sangat Intim & Merangkul.
- **Tingkat Urgensi CTA:** Santai/Edukatif ⟷ Tinggi (FOMO / Penawaran Terbatas).

### 4. Format Output Ketat (Strict Markdown)
Setiap caption selalu dibagi ke dalam 4 blok terpisah yang dilengkapi tombol **Salin Per Blok**:
- `[HOOK]`: 1 baris pertama penghenti scroll (dengan inspeksi batas karakter sebelum lipatan *'...more'*).
- `[BODY]`: Paragraf bernapas sesuai formula copywriting aktif (**AIDA**, **PAS**, **BAB**, atau **FAB**).
- `[CTA]`: Ajakan bertindak terukur sesuai tingkat urgensi.
- `[HASHTAGS]`: Kurasi tagar niche, trending, dan core keyword.

### 5. Multi-Platform Social Simulator & Character Constraint Meter
- **Instagram:** Batas 2.200 karakter + deteksi lipatan hook 125 karakter.
- **TikTok:** Batas ringkas untuk retensi video.
- **LinkedIn:** Format thought leadership B2B.
- **X / Twitter:** Batas 280 karakter dengan meter progres bar interaktif.

### 6. Riwayat Draft (History Manager) & Ekspor Koleksi (.md)
- Setiap caption tersimpan otomatis di memori lokal.
- Muat kembali draft lama ke editor dengan satu klik.
- **Ekspor Semua (.md):** Unduh seluruh koleksi caption yang pernah dibuat ke file Markdown rapi.

---

## 🛠️ Cara Menjalankan

### Cara 1: Buka Langsung File HTML (Paling Cepat)
Cukup klik ganda [index.html](file:///Users/muhammadilyasa/Website%20aplikasi/caption%20maker/index.html) atau jalankan di Terminal:
```bash
open "/Users/muhammadilyasa/Website aplikasi/caption maker/index.html"
```

### Cara 2: Jalankan via Local Node Server (Bebas Dependency)
```bash
node server.js
# atau
npm start
```
Akses di browser: `http://localhost:3000`
