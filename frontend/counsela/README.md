# Counsela - Platform Konsultasi Hukum Online

## Deskripsi

Counsela adalah platform konsultasi hukum online yang menghubungkan masyarakat (client) dengan lawyer profesional terpercaya. Client dapat melakukan booking konsultasi, melakukan pembayaran DP 50% dan pelunasan 50%, serta memberikan review setelah konsultasi selesai. Admin berperan memverifikasi pembayaran dan mengelola platform.

## Fitur

### Client
- Registrasi dan login
- Melihat daftar lawyer
- Melihat jadwal lawyer real-time
- Booking konsultasi
- Upload bukti DP (50%)
- Upload bukti pelunasan (50%)
- Melihat riwayat konsultasi
- Memberikan review dan rating
- Hapus riwayat konsultasi dari tampilan sendiri (soft delete)

### Lawyer
- Login dengan role lawyer
- Menerima atau menolak orderan konsultasi
- Menambahkan meeting link (Zoom/Google Meet)
- Menyelesaikan kasus konsultasi
- Melihat riwayat orderan
- Hapus riwayat konsultasi dari tampilan sendiri (soft delete)

### Admin
- Login dengan role admin
- Dashboard statistik (total users, lawyers, konsultasi, reviews)
- Verifikasi pembayaran DP client
- Verifikasi pembayaran pelunasan client
- Melihat dompet admin (fee 3% dari setiap transaksi)
- Kelola user (CRUD)
- Kelola lawyer (tambah, edit, hapus)

### Umum
- Dark mode / Light mode
- Notifikasi real-time (toast notification)
- Responsive design (mobile friendly)

## ERD (Entity Relationship Diagram)

### Tabel `users`

| Kolom | Keterangan |
|---|---|
| id | PK |
| nama | |
| email | |
| password | |
| role | |
| created_at | |

### Tabel `lawyers`

| Kolom | Keterangan |
|---|---|
| id | PK |
| user_id | FK → users.id |
| spesialisasi | |
| pengalaman | |
| deskripsi | |
| tarif | |
| foto_profil | |
| firma_hukum | |
| rating | |
| status_aktif | |

### Tabel `lawyer_schedules`

| Kolom | Keterangan |
|---|---|
| id | PK |
| lawyer_id | FK → lawyers.id |
| day_of_week | |
| start_time | |
| end_time | |

### Tabel `consultations`

| Kolom | Keterangan |
|---|---|
| id | PK |
| client_id | FK → users.id |
| lawyer_id | FK → lawyers.id |
| tanggal_konsultasi | |
| jam_konsultasi | |
| judul_kasus | |
| deskripsi_kasus | |
| meeting_link | |
| status | |
| dp_amount | |
| dp_proof | |
| dp_payment_status | |
| final_payment_proof | |
| final_payment_status | |
| hidden_for | array |
| created_at | |

### Tabel `documents`

| Kolom | Keterangan |
|---|---|
| id | PK |
| consultation_id | FK → consultations.id |
| file_name | |
| file_url | |
| uploaded_at | |

### Tabel `reviews`

| Kolom | Keterangan |
|---|---|
| id | PK |
| consultation_id | FK → consultations.id |
| client_id | FK → users.id |
| lawyer_id | FK → lawyers.id |
| rating | |
| komentar | |
| created_at | |

### Tabel `admin_wallet`

| Kolom | Keterangan |
|---|---|
| id | PK |
| transaction_id | |
| consultation_id | FK → consultations.id |
| amount | |
| fee_amount | 3% dari amount |
| net_amount | |
| type | |
| status | |
| created_at | |

### Tabel `admin_balance`

| Kolom | Keterangan |
|---|---|
| id | PK |
| total_fees | |
| total_transactions | |
| updated_at | |

### Relasi Antar Tabel

| Tabel Induk | Tabel Anak | Kolom Penghubung |
|---|---|---|
| users | lawyers | lawyers.user_id → users.id |
| lawyers | lawyer_schedules | lawyer_schedules.lawyer_id → lawyers.id |
| users | consultations | consultations.client_id → users.id |
| lawyers | consultations | consultations.lawyer_id → lawyers.id |
| consultations | documents | documents.consultation_id → consultations.id |
| consultations | reviews | reviews.consultation_id → consultations.id |
| consultations | admin_wallet | admin_wallet.consultation_id → consultations.id |
| admin_wallet | admin_balance | agregasi data (tidak ada FK langsung) |

## Tech Stack

### Frontend

| Teknologi | Kegunaan |
|---|---|
| React 18 | Library UI |
| Vite | Build tool |
| Tailwind CSS | Styling |
| React Router DOM | Routing |
| Axios | HTTP client |
| Framer Motion | Animasi |
| React Hot Toast | Notifikasi |

### Backend

| Teknologi | Kegunaan |
|---|---|
| Node.js | Runtime |
| Express.js | Framework web |
| PostgreSQL | Database |
| Supabase | Hosting database & storage |
| JWT | Autentikasi |
| Bcrypt | Hashing password |
| Cookie Parser | Mengelola cookie |
| Multer | Upload file |
| CORS | Cross-origin resource sharing |

## Cara Install dan Menjalankan

### Prasyarat

- Node.js (v18 atau lebih baru)
- pnpm
- Akun Supabase (untuk database & storage)

### 1. Clone Repository

```bash
git clone https:/https:/github.com/waannna/counsela.git
cd counsela
```

### 2. Setup Backend

```bash
cd backend
pnpm install
cp .env.example .env
```

Edit file `.env`:

```env
PORT=5000
DATABASE_URL=postgresql://your-database-url
JWT_SECRET=your_jwt_secret_key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

```bash
pnpm run dev
```

### 3. Setup Frontend

```bash
cd frontend
pnpm install
cp .env.example .env
```

Edit file `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

```bash
pnpm run dev
```

### 4. Akses Aplikasi

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

## Kontributor

- Ade Dermawan - Fullstack Developer

## Lisensi

© 2024 Counsela. All rights reserved.