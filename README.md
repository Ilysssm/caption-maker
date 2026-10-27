# Caption Maker AI Studio — Strategic Copywriting & Trend Analytics

**Aplikasi web copywriting media sosial berkonversi tinggi dan analisis tren pencarian (Social SEO)** yang ditenagai oleh **Google Gemini AI (Model: `gemini-3.8-flash`)** via SDK resmi `@google/genai`.

Aplikasi ini 100% *client-side* murni (Single Page Application / SPA) berbasis HTML, Tailwind CSS, dan JavaScript ES Module, sehingga dapat langsung di-deploy secara statis ke **GitHub Pages**, **Vercel**, atau **Netlify** tanpa membutuhkan server backend terpisah.

---

## 🌟 3 Modul Navigasi Utama (SPA)

### 1. ✍️ Studio Caption Maker
- **Google Gen AI Official SDK (`@google/genai`):** Menggunakan model AI terbaru `gemini-3.8-flash` dengan respon instan, pemahaman konteks psikologis yang tajam, dan pemrosesan bebas hambatan.
- **2 Mode Kerja Utama:**
  - 🎯 **Mode A: Strategic Copywriting (Prinsip Periklanan & Konversi):** Berfokus pada periklanan profesional, *creative brief*, Unique Selling Proposition (USP), pemecahan masalah konsumen, dan formula persuasi teruji (AIDA, PAS, BAB, FAB).
  - 💬 **Mode B: Human-Professional Caption (Natural & Berjiwa):** Berfokus pada gaya bahasa media sosial harian yang bernyawa, dinamis, ritme bervariasi, serta **MELARANG KERAS** frasa klise AI robotik seperti *"Halo Sobat"*, *"Tahukah Anda"*, *"Di era modern ini"*, *"Oleh karena itu"*, *"Kesimpulannya"*.
- **Parameter Kontrol Presisi:**
  - 👥 **Target Audiens:** Pemilik Bisnis/UMKM, Gen Z & Millennial, Orang Tua/Parent, Profesional/Pekerja Kantoran, Audiens Umum.
  - 🎙️ **Sudut Pandang / Tone of Voice:** Empatic & Warm, Authoritative & Expert, Provocative & Bold, Humorous & Casual.
  - 🎯 **Tujuan Konten (CTA Objective):** Mancing Komentar & Diskusi, Simpan & Bagikan (Save/Share), Konversi Penjualan/Link, Brand Awareness.
  - 📱 **Target Platform Lengkap:** Instagram, YouTube, TikTok, LinkedIn, X / Twitter.
- **Penggeser Karakter Emosional Dinamis:**
  - Kehangatan Emosional (Sangat Formal ⟷ Sangat Intim & Personal).
  - Tingkat Urgensi CTA (Halus & Santai ⟷ FOMO Maksimal / Hard Sell).
- **Format Output 4 Blok:** `[HOOK]`, `[BODY]`, `[CTA]`, dan `[HASHTAGS]` yang dapat disalin per blok atau seluruhnya dalam format Markdown murni.
- **Kartu Analisis Strategis & Social SEO:** Menampilkan alasan psikologis formula, kata kunci pencarian populer (Social SEO pills), tips retensi 3 detik, dan estimasi skor viralitas hook.
- **Simulator Feed Sosial:** Meninjau tampilan caption di feed Instagram, YouTube, TikTok, LinkedIn, dan X secara real-time.
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
- Gemini 3.8 Flash memetakan:
  - 🎯 **Sudut Pandang yang Sedang Naik Daun (Trending Angles)**.
  - 🔍 **Kata Kunci Pencarian Populer (Social SEO Keywords)**.
  - ⚡ **Ide Hook Penghenti Scroll (Viral Hooks)**.
- Tombol **"Pakai Topik Ini di Studio ➔"** untuk langsung memindahkan topik hasil riset ke editor penulisan caption.
- Pemantauan metrik retensi 3 detik dan rasio penonton tanpa suara.

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
