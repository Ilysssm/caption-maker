# Caption Maker AI Studio — Strategic Copywriting & Trend Analytics

**Aplikasi web copywriting media sosial berkonversi tinggi dan analisis tren pencarian (Social SEO)** yang ditenagai oleh **Google Gemini AI (Model: `gemini-2.5-flash`)** via SDK resmi `@google/genai`.

Aplikasi ini 100% *client-side* murni (Single Page Application / SPA) berbasis HTML, Tailwind CSS, dan JavaScript ES Module, sehingga dapat langsung di-deploy secara statis ke **GitHub Pages**, **Vercel**, atau **Netlify** tanpa membutuhkan server backend terpisah.

---

## 🌟 3 Modul Navigasi Utama (SPA)

### 1. ✍️ Studio Caption Maker
- **Google Gen AI Official SDK (`@google/genai`):** Menggunakan model `gemini-2.5-flash` dengan respon cepat dan pemahaman konteks mendalam.
- **Dukungan Kunci Bawaan & Kustom:** Dilengkapi API Key bawaan langsung yang siap pakai, serta opsi simpan/ganti kunci pribadi melalui `localStorage`.
- **Target Platform Lengkap:**
  - 📸 **Instagram:** Format Reels & Feed dengan batas 2.200 karakter serta lipatan hook 125 karakter.
  - ▶️ **YouTube:** Judul video memikat, deskripsi lengkap, format bab & *timestamps* (`00:00 - Intro`, `01:25 - Tips Utama`), serta ajakan Subscribe/Like.
  - 🎵 **TikTok:** Ringkas, *fast-paced*, dan dioptimalkan untuk mesin pencari TikTok.
  - 💼 **LinkedIn:** Narasi berbobot (*thought leadership*), format spasi bernapas untuk audiens profesional & B2B.
  - 🐦 **X / Twitter:** Kalimat *punchy* 1 baris, padat, dan siap dijadikan *thread*.
- **Pilihan Persona & Tone of Voice:** Kasual / Bisnis, Psikolog / Ruang Kalem, Profesional Korporat, Kreatif / Gen-Z, Edukator & Mentor, Direct Promo & Launch.
- **Formula Copywriting Teruji:** AIDA, PAS, BAB, dan FAB.
- **Penggeser Karakter Emosional (Tone Sliders):** 
  - Kehangatan Emosi (Sangat Formal ⟷ Sangat Intim & Personal).
  - Tingkat Urgensi CTA (Halus & Santai ⟷ FOMO Maksimal / Hard Sell).
- **Format Output 4 Blok Ketat:** `[HOOK]`, `[BODY]`, `[CTA]`, dan `[HASHTAGS]` yang dapat disalin per blok atau seluruhnya dalam format Markdown murni.
- **Kartu Analisis Tren & Social SEO:** Menampilkan sudut pandang psikologi audiens, daftar kata kunci pencarian populer, tips retensi 3 detik, dan skor potensi viralitas hook.
- **Penyimpanan Otomatis:** Setiap hasil *generate* langsung tersimpan otomatis ke dalam **Riwayat Draft**.

### 2. 📚 Riwayat Draft (Draft History Manager)
- Menyimpan semua caption yang pernah dibuat ke dalam browser lokal (`localStorage`).
- Badge indikator angka di sebelah tab otomatis memperbarui jumlah draft secara real-time.
- **Fitur Aksi per Draft:**
  - 📋 **Salin:** Menyalin isi draft lengkap ke clipboard.
  - ✍️ **Muat ke Studio:** Mengirim kembali ide draft ke editor Studio untuk dikembangkan lebih lanjut.
  - 🗑️ **Hapus:** Menghapus draft tertentu.
- **Fitur Ekspor & Pembersihan:**
  - 📥 **Ekspor Semua (.md):** Mengunduh seluruh riwayat caption ke file Markdown rapi.
  - 🧹 **Hapus Semua:** Membersihkan seluruh riwayat draft dengan konfirmasi aman.

### 3. 📈 Analytics Hub (Trend & Search Intent Explorer)
- **Riset Topik & Niche:** Masukkan kata kunci atau nama produk, lalu klik tombol **"Analisis Tren"**.
- Gemini 2.5 Flash memetakan:
  - 🎯 **Sudut Pandang yang Sedang Naik Daun (Trending Angles)**.
  - 🔍 **Kata Kunci Pencarian Populer (Social SEO Keywords)**.
  - ⚡ **Ide Hook Penghenti Scroll (Viral Hooks)**.
- Tombol **"Pakai Topik Ini di Studio ➔"** untuk langsung memindahkan topik hasil riset ke editor penulisan caption.
- Pemantauan metrik retensi 3 detik (34.8%) dan rasio penonton tanpa suara (85.4%).

---

## 🔑 Pengaturan Kunci Google Gemini API

Aplikasi sudah memiliki **API Key Default** yang tertanam sehingga pengguna bisa langsung membuat caption tanpa harus login atau setup tambahan.

Jika Anda ingin menggunakan API Key pribadi Anda:
1. Buka [Google AI Studio](https://aistudio.google.com/app/apikey) untuk membuat kunci gratis.
2. Di web aplikasi, klik tombol **"Pengaturan"** di kanan atas.
3. Masukkan kunci Anda ke kolom **Google Gemini API Key**.
4. Klik **"Uji Key"** untuk memastikan koneksi aktif.
5. Klik **"Simpan Pengaturan"** (kunci akan tersimpan aman di `localStorage` browser Anda).
6. Untuk kembali ke kunci default, cukup klik **"Pakai Kunci Default"**.

---

## 📊 Integrasi Google Analytics 4 (GA4)

1. Buat Web Data Stream di [Google Analytics](https://analytics.google.com).
2. Salin Measurement ID Anda (`G-XXXXXXXXXX`).
3. Masukkan ke modal **Pengaturan** pada kolom **Google Analytics (GA4) ID**, lalu klik **Simpan Pengaturan**.
4. Anda juga dapat menggunakan tombol toggle di bilah navigasi atas:
   `Google Analytics & Search Index: Aktif [AUTO]` untuk mengaktifkan atau menonaktifkan optimasi SEO dan pelacakan.

---

## 🚀 Cara Menjalankan & Memperbarui GitHub Pages

### 1. Buka Secara Lokal
Klik ganda file [index.html](file:///Users/muhammadilyasa/Website%20aplikasi/caption%20maker/index.html) atau jalankan di Terminal:
```bash
open "/Users/muhammadilyasa/Website aplikasi/caption maker/index.html"
```

### 2. Mengunggah ke GitHub Pages
Semua perubahan telah di-commit ke Git. Untuk memperbarui GitHub Pages:
```bash
cd "/Users/muhammadilyasa/Website aplikasi/caption maker"
git push origin main
```
Situs dapat diakses di:
👉 **`https://ilysssm.github.io/caption-maker/`**
