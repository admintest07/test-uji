# Supervisi Sarpras LPI Sabilillah Malang

Aplikasi Jurnal Supervisi Kebersihan, Kerapian, dan Perawatan Sarpras Lembaga Pendidikan Islam (LPI) Sabilillah Malang berbasis Progressive Web App (PWA) dengan notifikasi realtime di HP.

---

## 🚀 Panduan Upload ke GitHub & Deploy ke Vercel

Proyek ini telah dikonfigurasi penuh untuk siap di-deploy langsung ke **Vercel** melalui **GitHub**, lengkap dengan:
- `vercel.json` untuk routing SPA dan Serverless Functions
- `/api` serverless endpoints untuk Web Push Notifications (`/api/send-push`, `/api/subscribe`, `/api/vapid-key`)
- Konfigurasi Service Worker PWA (`sw.js`) dan Manifest PWA

---

### Langkah 1: Upload (Push) Kode ke GitHub

1. Buka terminal di komputer Anda pada folder proyek ini.
2. Inisialisasi Git (jika belum):
   ```bash
   git init
   ```
3. Tambahkan semua file dan buat commit awal:
   ```bash
   git add .
   git commit -m "feat: initial commit supervisi LPI Sabilillah PWA siap Vercel"
   ```
4. Ubah nama branch utama menjadi `main`:
   ```bash
   git branch -M main
   ```
5. Buat repositori baru di akun GitHub Anda (misal dinamai `supervisi-sabilillah`).
6. Hubungkan git lokal ke repositori GitHub:
   ```bash
   git remote add origin https://github.com/USERNAME-ANDA/supervisi-sabilillah.git
   ```
   *(Ganti `USERNAME-ANDA` dengan username GitHub Anda)*
7. Upload ke GitHub:
   ```bash
   git push -u origin main
   ```

---

### Langkah 2: Hubungkan Repositori GitHub ke Vercel

1. Buka [https://vercel.com](https://vercel.com) dan masuk (Login) dengan akun GitHub Anda.
2. Klik tombol **"Add New..."** lalu pilih **"Project"**.
3. Di daftar repositori GitHub yang muncul, cari repositori `supervisi-sabilillah`, lalu klik tombol **"Import"**.
4. Di halaman **Configure Project**:
   - **Framework Preset**: Vercel akan otomatis mendeteksi **Vite** (atau pilih `Vite` jika belum otomatis).
   - **Root Directory**: Biarkan `./` (default).
   - **Build Command**: `npm run build` (default).
   - **Output Directory**: `dist` (default).
5. *(Opsional)* **Environment Variables**:
   Secara default, kunci VAPID Web Push sudah tertanam secara aman di sistem. Namun bila ingin mengganti dengan kunci khusus Anda sendiri, Anda dapat menambahkan variabel di menu Environment Variables Vercel:
   - `VAPID_PUBLIC_KEY`
   - `VAPID_PRIVATE_KEY`
   - `VAPID_EMAIL`
6. Klik tombol **"Deploy"**.
7. Tunggu sekitar 1 menit hingga proses build selesai. Vercel akan memberikan domain HTTPS gratis (contoh: `supervisi-sabilillah.vercel.app`).

---

### Langkah 3: Menggunakan PWA & Notifikasi di HP

1. Buka link Vercel Anda di browser Chrome (Android) atau Safari (iOS).
2. Klik **"Tambahkan ke Layar Utama" / "Install Aplikasi"** (PWA).
3. Buka aplikasi yang telah terpasang di HP Anda.
4. Klik ikon lonceng di dashboard lalu pilih **"Aktifkan Notifikasi di HP Ini"** dan izinkan (*Allow*) notifikasi.
5. Notifikasi kini akan otomatis masuk ke pusat notifikasi HP (*notification center / status bar*) dan berbunyi, bahkan ketika aplikasi sedang ditutup!
