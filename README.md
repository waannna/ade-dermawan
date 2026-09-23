# Counsela — Platform Konsultasi Hukum Digital

<p align="center">
  <img src="frontend/counsela/public/favicon.svg" width="80" height="80" alt="Counsela Logo" />
</p>

<p align="center">
  <strong>Platform teknologi hukum digital yang menghubungkan klien dengan advokat berlisensi secara aman, transparan, dan terpercaya.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Vue.js-3.5-4FC08D?style=flat-square&logo=vuedotjs&logoColor=white" alt="Vue 3" />
  <img src="https://img.shields.io/badge/Vite-8.0-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js Express" />
  <img src="https://img.shields.io/badge/Database-PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL Supabase" />
</p>

---

##  Tentang Proyek

**Counsela** adalah aplikasi web layanan hukum modern (*Legal-Tech*) yang dirancang untuk mempermudah masyarakat dalam berkonsultasi dengan advokat profesional. Mengusung estetika desain minimalis kontras tinggi (*Apple & Arc aesthetic*), antarmuka yang ramah pengguna di ponsel (*mobile-first*), serta kepatuhan pada kerahasiaan hubungan advokat-klien (Pasal 19 UU No. 18/2003).

---

##  Fitur Utama

###  Tampilan & Pengalaman Pengguna (Mobile-First)
- **Bilah Navigasi Bawah (*Bottom Navigation Bar*)**: Akses cepat 5 menu utama di bagian bawah layar ponsel.
- **Katalog Advokat 2 Kolom**: Tampilan daftar advokat berdampingan (*side-by-side*) yang pas dan nyaman di layar ponsel.
- **Horizontal Swipe Carousel**: Navigasi geser ke samping secara halus (*snap scroll*) untuk daftar advokat unggulan di Beranda.
- **Command Palette (⌘K / Ctrl+K)**: Pencarian instan untuk advokat, draf dokumen, regulasi pasal, dan menu navigasi.
- **100% Ikon Vektor Presisi**: Tampilan bersih profesional berbasis `@lucide/vue` tanpa emoji mentah.

###  Layanan & Manajemen Konsultasi
- **Direktori & Profil Advokat**: Informasi transparan mengenai spesialisasi, tahun pengalaman praktik, tarif sesi, dan ulasan terverifikasi.
- **Fitur Komparasi Advokat**: Membandingkan hingga 3 advokat secara berdampingan (tarif, DP, pengalaman, rating, ketersediaan).
- **Skema Pembayaran Bertahap (50/50 Escrow)**:
  - **Tahap 1**: Pembayaran DP 50% untuk reservasi jadwal konsultasi.
  - **Tahap 2**: Pelunasan 50% setelah sesi konsultasi selesai dilaksanakan.
- **Ruang Rapat Virtual Terintegrasi**: Tautan telekonferensi privat (Google Meet / Zoom) yang diatur langsung oleh advokat setelah verifikasi DP.
- **Sistem Pengarsipan Perkara**: Fitur arsip (*hide/unarchive*) untuk menyembunyikan atau memulihkan riwayat konsultasi.

###  Multi-Role Dashboard
- **Portal Klien**: Monitoring status kasus, riwayat pembayaran DP/pelunasan, akses ruang rapat, dan ulasan advokat.
- **Portal Advokat**: Kelola permintaan konsultasi masuk (*Terima/Tolak*), input tautan rapat, atur jadwal operasional, dan penyelesaian perkara.
- **Panel Admin**: Pengawasan statistik platform, verifikasi bukti transfer DP & pelunasan dengan *lightbox preview*, audit hak akses peran, serta pendapatan komisi platform.

---

##  Tech Stack

| Komponen | Teknologi |
| :--- | :--- |
| **Frontend Framework** | [Vue 3](https://vuejs.org/) (Composition API, `<script setup>`) |
| **Build Tool** | [Vite](https://vitejs.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Routing & State** | [Vue Router 4](https://router.vuejs.org/) & Vue Reactivity Composables |
| **Ikonografi** | [Lucide Vue](https://lucide.dev/) (`@lucide/vue`) |
| **Backend Framework** | [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/) |
| **Database** | [PostgreSQL](https://www.postgresql.org/) (Hosted on [Supabase](https://supabase.com/)) |
| **Autentikasi** | JSON Web Token (JWT) & bcryptjs |

---

##  Struktur Direktori

```text
ade-dermawan/
├── backend/
│   ├── config/             # Konfigurasi database PostgreSQL
│   ├── controllers/        # Logika bisnis (auth, consultations, lawyers, reviews, dll.)
│   ├── middleware/         # Autentikasi JWT & verifikasi peran (Role Guard)
│   ├── routes/             # Definisi endpoint RESTful API
│   ├── server.js           # Titik masuk server Express
│   └── package.json
│
├── frontend/counsela/
│   ├── public/             # Aset statis & Favicon resmi (SVG & PNG)
│   ├── src/
│   │   ├── components/     # Komponen UI (BottomNav, Header, Footer, Cards, Modal, dll.)
│   │   ├── composables/    # Reusable logic (useAuth, useToast)
│   │   ├── pages/          # Halaman aplikasi (Home, Lawyers, Dashboards, Auth, dll.)
│   │   ├── router/         # Konfigurasi rute halaman & proteksi akses
│   │   ├── service/        # Layanan API client (Axios)
│   │   ├── App.vue         # Root component
│   │   └── main.js         # Entry point aplikasi
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── .gitignore              # Proteksi node_modules & file sensitif
└── README.md
```

---

##  Panduan Menjalankan Proyek Secara Lokal

### 1. Prasyarat
- [Node.js](https://nodejs.org/) (versi 18 atau lebih baru)
- Paket manajer: `pnpm` (disarankan) atau `npm`

### 2. Kloning Repository
```bash
git clone https://github.com/waannna/ade-dermawan.git
cd ade-dermawan
```

### 3. Menjalankan Backend API
```bash
# Masuk ke folder backend
cd backend

# Instal dependensi
pnpm install

# Jalankan server pengembangan
node server.js
```
> Server backend akan aktif di: `http://localhost:5000`

### 4. Menjalankan Frontend
Buka terminal baru di direktori root:
```bash
# Masuk ke folder frontend
cd frontend/counsela

# Instal dependensi
pnpm install

# Jalankan server pengembangan
pnpm run dev
```
> Aplikasi web akan aktif di: `http://localhost:5173`

---

##  Hak Cipta & Keamanan

- **Kerahasiaan Jabatan Advokat**: Seluruh data perkara dan komunikasi konsultasi dilindungi asas kerahasiaan jabatan advokat sesuai ketentuan **Pasal 19 Undang-Undang No. 18 Tahun 2003 tentang Advokat**.
- Dibuat dan dikembangkan oleh **waannna / Ade Dermawan**.
