# Panduan Rilis Publik (Release Guide) — Caption Maker AI Studio

Aplikasi ini telah dikonfigurasi penuh dengan standar **Production & PWA (Progressive Web App)** sehingga siap dirilis ke publik secara gratis dengan berbagai pilihan platform.

---

## ⚡ Opsi 1: Rilis Instan via Netlify Drop (Paling Mudah — 30 Detik, Tanpa Terminal)

Ini adalah cara tercepat di dunia untuk merilis website ke internet tanpa koding:

1. Buka browser dan kunjungi: **[app.netlify.com/drop](https://app.netlify.com/drop)**
2. Buka **Finder** di Mac Anda, cari folder:
   `/Users/muhammadilyasa/Website aplikasi/caption maker`
3. **Tarik (Drag & Drop)** folder tersebut langsung ke area kotak di situs Netlify Drop.
4. Tunggu 5 detik. Selesai!
5. Anda langsung mendapatkan link publik dengan sertifikat SSL (HTTPS) gratis, misalnya:
   `https://caption-maker-ai.netlify.app`

---

## ▲ Opsi 2: Rilis via Vercel (Standar Developer Profesional)

Jika Anda ingin merilis via platform Vercel yang super kencang:

1. Buka Terminal di folder ini:
   ```bash
   cd "/Users/muhammadilyasa/Website aplikasi/caption maker"
   ```
2. Jalankan perintah:
   ```bash
   npx vercel
   ```
3. Tekan **Enter** untuk menyetujui pengaturan default (file `vercel.json` sudah disiapkan otomatis).
4. Dalam 15 detik, Anda akan mendapatkan URL publik Vercel Anda (misal `https://caption-maker.vercel.app`).

---

## 🐙 Opsi 3: Rilis via GitHub & GitHub Pages (Gratis Selamanya)

File workflow otomatis [deploy.yml](file:///Users/muhammadilyasa/Website%20aplikasi/caption%20maker/.github/workflows/deploy.yml) telah disiapkan.

1. Buat repositori baru di akun GitHub Anda (misal bernama `caption-maker`).
2. Jalankan perintah di Terminal:
   ```bash
   cd "/Users/muhammadilyasa/Website aplikasi/caption maker"
   git remote add origin https://github.com/USERNAME-ANDA/caption-maker.git
   git branch -M main
   git push -u origin main
   ```
3. Di halaman repositori GitHub Anda:
   - Klik tab **Settings** > **Pages**
   - Pada bagian **Build and deployment**, pilih Source: **GitHub Actions**
4. Website akan otomatis dirilis di: `https://USERNAME-ANDA.github.io/caption-maker/`

---

## 📱 Opsi 4: Pasang sebagai Aplikasi Asli (PWA) di Mac & iPhone

Karena aplikasi ini sudah dilengkapi [manifest.json](file:///Users/muhammadilyasa/Website%20aplikasi/caption%20maker/manifest.json), [sw.js](file:///Users/muhammadilyasa/Website%20aplikasi/caption%20maker/sw.js), dan [icon.svg](file:///Users/muhammadilyasa/Website%20aplikasi/caption%20maker/icon.svg):

* **Di Mac (Safari):**
  Buka link aplikasi Anda di Safari, lalu klik menu bar:
  👉 **File > Add to Dock...** (Tambahkan ke Dock)
  *Aplikasi akan langsung muncul di Dock Mac Anda dengan jendela mandiri tanpa address bar, persis seperti aplikasi native macOS!*

* **Di iPhone / iPad (Safari):**
  Buka link aplikasi di Safari iPhone Anda, lalu:
  👉 Ketuk ikon **Bagikan (Share)** > pilih **Tambahkan ke Layar Utama (Add to Home Screen)**.
  *Aplikasi akan terpasang di layar home iPhone Anda lengkap dengan ikon Apple squircle!*
